import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { RolePermissionService } from './rolePermission.service';
import { CreateRolePermissionDto, CreateRolePermissionSchema } from './rolePermission.model';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe';

@Controller('role-permissions')
export class RolePermissionController {
  constructor(private readonly rolePermissionService: RolePermissionService) {}

  @Post()
  create(@Body(new ZodValidationPipe(CreateRolePermissionSchema)) createRolePermissionDto: CreateRolePermissionDto) {
    return this.rolePermissionService.create(createRolePermissionDto);
  }

  @Get()
  findAll() {
    return this.rolePermissionService.findAll();
  }

  @Get('role/:roleId')
  findByRole(@Param('roleId', ParseIntPipe) roleId: number) {
    return this.rolePermissionService.findByRole(roleId);
  }

  @Get('permission/:permissionId')
  findByPermission(@Param('permissionId', ParseIntPipe) permissionId: number) {
    return this.rolePermissionService.findByPermission(permissionId);
  }

  @Get('role/:roleId/permission/:permissionId')
  findOne(
    @Param('roleId', ParseIntPipe) roleId: number,
    @Param('permissionId', ParseIntPipe) permissionId: number,
  ) {
    return this.rolePermissionService.findOne(roleId, permissionId);
  }

  @Delete('role/:roleId/permission/:permissionId')
  remove(
    @Param('roleId', ParseIntPipe) roleId: number,
    @Param('permissionId', ParseIntPipe) permissionId: number,
  ) {
    return this.rolePermissionService.remove(roleId, permissionId);
  }

  @Delete('role/:roleId')
  removeByRole(@Param('roleId', ParseIntPipe) roleId: number) {
    return this.rolePermissionService.removeByRole(roleId);
  }

  @Delete('permission/:permissionId')
  removeByPermission(@Param('permissionId', ParseIntPipe) permissionId: number) {
    return this.rolePermissionService.removeByPermission(permissionId);
  }
}
