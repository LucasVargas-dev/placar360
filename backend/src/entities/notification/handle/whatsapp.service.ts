import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as twilio from 'twilio';

@Injectable()
export class WhatsAppService {
  private readonly logger = new Logger(WhatsAppService.name);
  private readonly client: twilio.Twilio;
  private readonly fromNumber: string;

  constructor(private configService: ConfigService) {
    const accountSid = this.configService.get<string>('TWILIO_ACCOUNT_SID');
    const authToken = this.configService.get<string>('TWILIO_AUTH_TOKEN');
    this.fromNumber = this.configService.get<string>('TWILIO_WHATSAPP_NUMBER', 'whatsapp:+14155238886');

    if (!accountSid || !authToken) {
      this.logger.warn('Twilio credentials not configured. WhatsApp notifications will be disabled.');
      this.client = null;
    } else {
      this.client = twilio(accountSid, authToken);
    }
  }

  async sendNotificationMessage(notification: any): Promise<void> {
    if (!this.client) {
      this.logger.warn('Twilio not configured, skipping notification');
      return;
    }

    try {
      const user = notification.user;
      const phoneNumber = this.formatPhoneNumber(user.phone);
      
      if (!phoneNumber) {
        throw new Error('User phone number not available');
      }

      const message = this.generateWhatsAppMessage(notification);
      
      const response = await this.sendMessage(phoneNumber, message);
      
      this.logger.log(`WhatsApp message sent successfully: ${response.sid}`);
    } catch (error) {
      this.logger.error('Failed to send WhatsApp message:', error);
      throw error;
    }
  }

  private async sendMessage(to: string, message: string): Promise<any> {
    const toNumber = `whatsapp:${to}`;
    
    const response = await this.client.messages.create({
      body: message,
      from: this.fromNumber,
      to: toNumber,
    });

    return response;
  }

  private generateWhatsAppMessage(notification: any): string {
    const user = notification.user;
    const userName = user.person?.name || user.email;
    
    let message = `🏆 *Placar360*\n\n`;
    message += `Olá, ${userName}!\n\n`;
    message += `${notification.message}\n\n`;

    // Add type-specific content
    switch (notification.type) {
      case 'MATCH_REMINDER':
        message += this.generateMatchReminderWhatsApp(notification);
        break;
      case 'MATCH_RESULT':
        message += this.generateMatchResultWhatsApp(notification);
        break;
      case 'TOURNAMENT_UPDATE':
        message += this.generateTournamentUpdateWhatsApp(notification);
        break;
      case 'BOOKING_CONFIRMATION':
        message += this.generateBookingConfirmationWhatsApp(notification);
        break;
      case 'TOURNAMENT_STARTING':
        message += this.generateTournamentStartingWhatsApp(notification);
        break;
    }

    message += `\n_Esta é uma mensagem automática do Placar360._`;
    message += `\n_Para alterar suas preferências, acesse o aplicativo._`;

    return message;
  }

  private generateMatchReminderWhatsApp(notification: any): string {
    const data = notification.data;
    if (!data) return '';

    let content = `🏓 *Detalhes da Partida:*\n`;
    content += `📍 Quadra: ${data.courtName}\n`;
    content += `⏰ Horário: ${new Date(data.startTime).toLocaleString('pt-BR')}\n`;
    
    if (data.opponentName) {
      content += `👤 Adversário: ${data.opponentName}\n`;
    }
    
    if (data.tournamentName) {
      content += `🏆 Torneio: ${data.tournamentName}\n`;
    }

    content += `\n💡 *Dicas:*\n`;
    content += `• Chegue 15 min antes\n`;
    content += `• Traga seus equipamentos\n`;
    content += `• Mantenha-se hidratado`;

    return content;
  }

  private generateMatchResultWhatsApp(notification: any): string {
    const data = notification.data;
    if (!data) return '';

    let content = `🏆 *Resultado da Partida:*\n`;
    content += `📍 Quadra: ${data.courtName}\n`;
    content += `⏰ Horário: ${new Date(data.startTime).toLocaleString('pt-BR')}\n`;
    
    if (data.result) {
      content += `🎯 Resultado: ${data.result}\n`;
    }
    
    if (data.score) {
      content += `📊 Placar: ${data.score}\n`;
    }
    
    if (data.tournamentName) {
      content += `🏆 Torneio: ${data.tournamentName}\n`;
    }

    content += `\n👏 Parabéns pela participação! Continue praticando!`;

    return content;
  }

  private generateTournamentUpdateWhatsApp(notification: any): string {
    const data = notification.data;
    if (!data) return '';

    let content = `🏆 *Atualização do Torneio:*\n`;
    content += `📝 Torneio: ${data.tournamentName}\n`;
    content += `🔄 Tipo: ${this.getUpdateTypeLabel(data.updateType)}\n\n`;
    content += `📋 ${data.message}\n\n`;
    content += `📱 Acesse o app para mais detalhes!`;

    return content;
  }

  private generateBookingConfirmationWhatsApp(notification: any): string {
    const data = notification.data;
    if (!data) return '';

    let content = `✅ *Reserva Confirmada:*\n`;
    content += `📍 Quadra: ${data.courtName}\n`;
    content += `⏰ Horário: ${new Date(data.startTime).toLocaleString('pt-BR')}\n`;
    
    if (data.totalAmount) {
      content += `💰 Valor: R$ ${data.totalAmount.toFixed(2)}\n`;
    }

    content += `\n📝 Anote o horário e não se esqueça!`;

    return content;
  }

  private generateTournamentStartingWhatsApp(notification: any): string {
    const data = notification.data;
    if (!data) return '';

    let content = `🚀 *Torneio Iniciando:*\n`;
    content += `🏆 Torneio: ${data.tournamentName}\n`;
    content += `📅 Data: ${new Date(data.startDate).toLocaleString('pt-BR')}\n`;
    content += `📍 Local: ${data.location}\n\n`;
    content += `🏅 Boa sorte! Que vença o melhor!`;

    return content;
  }

  private getUpdateTypeLabel(updateType: string): string {
    const labels = {
      'REGISTRATION_OPEN': 'Inscrições Abertas',
      'REGISTRATION_CLOSED': 'Inscrições Encerradas',
      'SCHEDULE_UPDATED': 'Cronograma Atualizado',
      'CANCELLED': 'Cancelado',
    };
    
    return labels[updateType] || updateType;
  }

  private formatPhoneNumber(phone: string): string | null {
    if (!phone) return null;

    // Remove all non-numeric characters
    const cleaned = phone.replace(/\D/g, '');

    // Brazilian phone number format
    if (cleaned.length === 11 && cleaned.startsWith('55')) {
      // Already includes country code
      return cleaned;
    } else if (cleaned.length === 11 && !cleaned.startsWith('55')) {
      // Add Brazil country code
      return `55${cleaned}`;
    } else if (cleaned.length === 10) {
      // Add country code and mobile prefix
      return `55${cleaned}`;
    }

    // Return as is for international numbers
    return cleaned;
  }

  // Test WhatsApp functionality
  async sendTestMessage(to: string, message: string): Promise<void> {
    if (!this.client) {
      throw new Error('Twilio not configured');
    }

    try {
      const phoneNumber = this.formatPhoneNumber(to);
      
      if (!phoneNumber) {
        throw new Error('Invalid phone number format');
      }

      const testMessage = `🏆 *Placar360 - Teste*\n\n${message}\n\n_Este é um teste do sistema de notificações._`;
      
      const response = await this.sendMessage(phoneNumber, testMessage);
      
      this.logger.log(`Test WhatsApp message sent successfully: ${response.sid}`);
    } catch (error) {
      this.logger.error('Failed to send test WhatsApp message:', error);
      throw error;
    }
  }
}
