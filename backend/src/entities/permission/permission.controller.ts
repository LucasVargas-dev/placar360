import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { PermissionService } from './permission.service';
import { CreatePermissionDto, UpdatePermissionDto, CreatePermissionSchema, UpdatePermissionSchema } from './permission.model';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe';

@Controller('permissions')
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @Post()
  create(@Body(new ZodValidationPipe(CreatePermissionSchema)) createPermissionDto: CreatePermissionDto) {
    return this.permissionService.create(createPermissionDto);
  }

  @Get()
  findAll() {
    return this.permissionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.permissionService.findOne(id);
  }

  @Get('resource/:resource')
  findByResource(@Param('resource') resource: string) {
    return this.permissionService.findByResource(resource);
  }

  @Get('resource/:resource/action/:action')
  findByResourceAndAction(
    @Param('resource') resource: string,
    @Param('action') action: string,
  ) {
    return this.permissionService.findByResourceAndAction(resource, action);
  }

  @Get(':id/roles')
  getRoles(@Param('id', ParseIntPipe) id: number) {
    return this.permissionService.getRoles(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ZodValidationPipe(UpdatePermissionSchema)) updatePermissionDto: UpdatePermissionDto,
  ) {
    return this.permissionService.update(id, updatePermissionDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.permissionService.remove(id);
  }
}
