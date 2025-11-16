import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    this.initializeTransporter();
  }

  private initializeTransporter(): void {
    const port = this.configService.get<number>('SMTP_PORT', 587);
    const secure = this.configService.get<boolean>('SMTP_SECURE', port === 465); // true for 465, false for other ports
    
    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('SMTP_HOST', 'smtp.gmail.com'),
      port,
      secure,
      auth: {
        user: this.configService.get<string>('SMTP_USER', 'placar360.app@gmail.com'),
        pass: this.configService.get<string>('SMTP_PASS', 'nehr oqgc uahl yjdw' ), // Use App Password for Gmail
      },
    });

    // Verify connection configuration
    this.transporter.verify((error, success) => {
      if (error) {
        this.logger.error('SMTP configuration error:', error);
        this.logger.error('For Gmail, you need to:');
        this.logger.error('1. Enable 2-Factor Authentication on your Google account');
        this.logger.error('2. Generate an App Password: https://myaccount.google.com/apppasswords');
        this.logger.error('3. Use the App Password instead of your regular password');
        this.logger.error('4. Set SMTP_PASS environment variable with the App Password');
      } else {
        this.logger.log('SMTP server is ready to take our messages');
      }
    });
  }

  async sendNotificationEmail(notification: any): Promise<void> {
    try {
      const user = notification.user;
      const userName = user.person?.name || user.email;

      const mailOptions = {
        from: {
          name: 'Placar360',
          address: this.configService.get<string>('SMTP_FROM', this.configService.get<string>('SMTP_USER')),
        },
        to: user.email,
        subject: notification.title,
        html: this.generateEmailTemplate(notification, userName),
      };

      const result = await this.transporter.sendMail(mailOptions);
      this.logger.log(`Email sent successfully: ${result.messageId}`);
    } catch (error) {
      this.logger.error('Failed to send email:', error);
      throw error;
    }
  }

  private generateEmailTemplate(notification: any, userName: string): string {
    const baseTemplate = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${notification.title}</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .header {
            background-color: #2c5aa0;
            color: white;
            padding: 20px;
            text-align: center;
            border-radius: 8px 8px 0 0;
          }
          .content {
            background-color: #f9f9f9;
            padding: 30px;
            border-radius: 0 0 8px 8px;
          }
          .notification-type {
            background-color: #e8f4fd;
            border-left: 4px solid #2c5aa0;
            padding: 15px;
            margin: 20px 0;
            border-radius: 4px;
          }
          .details {
            background-color: white;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          }
          .footer {
            text-align: center;
            margin-top: 30px;
            color: #666;
            font-size: 12px;
          }
          .logo {
            font-size: 24px;
            font-weight: bold;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="logo">🏆 Placar360</div>
        </div>
        <div class="content">
          <h2>Olá, ${userName}!</h2>
          <p>${notification.message}</p>
          
          ${this.generateTypeSpecificContent(notification)}
          
          <div class="footer">
            <p>Esta é uma mensagem automática do sistema Placar360.</p>
            <p>Para alterar suas preferências de notificação, acesse sua conta no aplicativo.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    return baseTemplate;
  }

  private generateTypeSpecificContent(notification: any): string {
    switch (notification.type) {
      case 'MATCH_REMINDER':
        return this.generateMatchReminderContent(notification);
      case 'MATCH_RESULT':
        return this.generateMatchResultContent(notification);
      case 'TOURNAMENT_UPDATE':
        return this.generateTournamentUpdateContent(notification);
      case 'BOOKING_CONFIRMATION':
        return this.generateBookingConfirmationContent(notification);
      case 'TOURNAMENT_STARTING':
        return this.generateTournamentStartingContent(notification);
      default:
        return '';
    }
  }

  private generateMatchReminderContent(notification: any): string {
    const data = notification.data;
    if (!data) return '';

    return `
      <div class="notification-type">
        <h3>🏓 Lembrete de Partida</h3>
        <p><strong>Quadra:</strong> ${data.courtName}</p>
        <p><strong>Horário:</strong> ${new Date(data.startTime).toLocaleString('pt-BR')}</p>
        ${data.opponentName ? `<p><strong>Adversário:</strong> ${data.opponentName}</p>` : ''}
        ${data.tournamentName ? `<p><strong>Torneio:</strong> ${data.tournamentName}</p>` : ''}
      </div>
      <div class="details">
        <p><strong>Dicas importantes:</strong></p>
        <ul>
          <li>Chegue com 15 minutos de antecedência</li>
          <li>Traga equipamentos adequados</li>
          <li>Mantenha-se hidratado</li>
        </ul>
      </div>
    `;
  }

  private generateMatchResultContent(notification: any): string {
    const data = notification.data;
    if (!data) return '';

    return `
      <div class="notification-type">
        <h3>🏆 Resultado da Partida</h3>
        <p><strong>Quadra:</strong> ${data.courtName}</p>
        <p><strong>Horário:</strong> ${new Date(data.startTime).toLocaleString('pt-BR')}</p>
        ${data.result ? `<p><strong>Resultado:</strong> ${data.result}</p>` : ''}
        ${data.score ? `<p><strong>Placar:</strong> ${data.score}</p>` : ''}
        ${data.tournamentName ? `<p><strong>Torneio:</strong> ${data.tournamentName}</p>` : ''}
      </div>
      <div class="details">
        <p>Parabéns pela participação! Continue praticando para melhorar ainda mais seu jogo.</p>
      </div>
    `;
  }

  private generateTournamentUpdateContent(notification: any): string {
    const data = notification.data;
    if (!data) return '';

    return `
      <div class="notification-type">
        <h3>🏆 Atualização do Torneio</h3>
        <p><strong>Torneio:</strong> ${data.tournamentName}</p>
        <p><strong>Tipo de Atualização:</strong> ${this.getUpdateTypeLabel(data.updateType)}</p>
      </div>
      <div class="details">
        <p>${data.message}</p>
        <p>Acesse o aplicativo para mais detalhes sobre o torneio.</p>
      </div>
    `;
  }

  private generateBookingConfirmationContent(notification: any): string {
    const data = notification.data;
    if (!data) return '';

    return `
      <div class="notification-type">
        <h3>✅ Confirmação de Reserva</h3>
        <p><strong>Quadra:</strong> ${data.courtName}</p>
        <p><strong>Horário:</strong> ${new Date(data.startTime).toLocaleString('pt-BR')}</p>
        ${data.totalAmount ? `<p><strong>Valor:</strong> R$ ${data.totalAmount.toFixed(2)}</p>` : ''}
      </div>
      <div class="details">
        <p>Sua reserva foi confirmada com sucesso! Anote o horário e não se esqueça.</p>
      </div>
    `;
  }

  private generateTournamentStartingContent(notification: any): string {
    const data = notification.data;
    if (!data) return '';

    return `
      <div class="notification-type">
        <h3>🚀 Torneio Iniciando</h3>
        <p><strong>Torneio:</strong> ${data.tournamentName}</p>
        <p><strong>Data de Início:</strong> ${new Date(data.startDate).toLocaleString('pt-BR')}</p>
        <p><strong>Local:</strong> ${data.location}</p>
      </div>
      <div class="details">
        <p>O torneio está prestes a começar! Boa sorte e que vença o melhor!</p>
      </div>
    `;
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

  // Test email functionality
  async sendTestEmail(to: string, subject: string, message: string): Promise<void> {
    try {
      const mailOptions = {
        from: {
          name: 'Placar360',
          address: this.configService.get<string>('SMTP_FROM', this.configService.get<string>('SMTP_USER')),
        },
        to,
        subject,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2>Teste de Email - Placar360</h2>
            <p>${message}</p>
            <p><em>Esta é uma mensagem de teste do sistema de notificações.</em></p>
          </div>
        `,
      };

      const result = await this.transporter.sendMail(mailOptions);
      this.logger.log(`Test email sent successfully: ${result.messageId}`);
    } catch (error) {
      this.logger.error('Failed to send test email:', error);
      throw error;
    }
  }
}
