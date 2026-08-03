import { generateBrandId } from '@ff/database';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from '../../database/prisma.service';
import { InviteTeamMemberDto, TeamRole, UpdateTeamMemberDto } from './dto/team.dto';

@Injectable()
export class TeamService {
  constructor(private prisma: PrismaService) {}

  async getAllTeamMembers() {
    const users = await this.prisma.db.user.findMany({
      where: {
        role: {
          in: ['SUPER_ADMIN', 'STAFF_ADMIN'],
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    return users.map((u) => {
      const meta = (u.adminMeta as Record<string, unknown>) || {};
      const position =
        (meta.position as TeamRole) ||
        (u.role === 'SUPER_ADMIN' ? TeamRole.SUPER_ADMIN : TeamRole.SALES_MANAGER);
      const cleanPhone = u.phone.replace(/\D/g, '').slice(-10);

      return {
        id: u.id,
        name: u.name,
        email: u.email,
        phone: cleanPhone,
        role: position,
        status: u.accountStatus,
        joinedAt: u.createdAt.toISOString(),
        updatedAt: u.updatedAt ? u.updatedAt.toISOString() : undefined,
      };
    });
  }

  async inviteTeamMember(dto: InviteTeamMemberDto) {
    const cleanPhone = dto.phone.replace(/\D/g, '').slice(-10);
    const formattedEmail = dto.email.trim().toLowerCase();

    // Check if user already exists by phone or email
    const existing = await this.prisma.db.user.findFirst({
      where: {
        OR: [
          { phone: cleanPhone },
          { phone: `+91 ${cleanPhone}` },
          { phone: `+91${cleanPhone}` },
          { email: formattedEmail },
        ],
      },
    });

    const dbRole = dto.role === TeamRole.SUPER_ADMIN ? 'SUPER_ADMIN' : 'STAFF_ADMIN';

    if (existing) {
      const currentMeta = (existing.adminMeta as Record<string, unknown>) || {};
      const updated = await this.prisma.db.user.update({
        where: { id: existing.id },
        data: {
          name: dto.name.trim(),
          email: formattedEmail,
          phone: cleanPhone,
          role: dbRole,
          accountStatus: 'ACTIVE',
          adminMeta: {
            ...currentMeta,
            position: dto.role,
          },
        },
      });

      return {
        id: updated.id,
        name: updated.name,
        email: updated.email,
        phone: cleanPhone,
        role: dto.role,
        status: updated.accountStatus,
        joinedAt: updated.createdAt.toISOString(),
        updatedAt: updated.updatedAt.toISOString(),
      };
    }

    const created = await this.prisma.db.user.create({
      data: {
        id: generateBrandId('CUST'),
        name: dto.name.trim(),
        email: formattedEmail,
        phone: cleanPhone,
        role: dbRole,
        accountStatus: 'ACTIVE',
        isPhoneVerified: true,
        isEmailVerified: true,
        adminMeta: {
          position: dto.role,
        },
      },
    });

    return {
      id: created.id,
      name: created.name,
      email: created.email,
      phone: cleanPhone,
      role: dto.role,
      status: created.accountStatus,
      joinedAt: created.createdAt.toISOString(),
      updatedAt: created.updatedAt.toISOString(),
    };
  }

  async updateTeamMember(id: string, dto: UpdateTeamMemberDto) {
    const user = await this.prisma.db.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException('Team member not found');
    }

    const currentMeta = (user.adminMeta as Record<string, unknown>) || {};
    const dbRole = dto.role
      ? dto.role === TeamRole.SUPER_ADMIN
        ? 'SUPER_ADMIN'
        : 'STAFF_ADMIN'
      : user.role;

    const updated = await this.prisma.db.user.update({
      where: { id },
      data: {
        role: dbRole,
        accountStatus: dto.status ? (dto.status as any) : user.accountStatus,
        adminMeta: {
          ...currentMeta,
          ...(dto.role ? { position: dto.role } : {}),
        },
      },
    });

    const meta = (updated.adminMeta as Record<string, unknown>) || {};
    const position =
      (meta.position as TeamRole) ||
      (updated.role === 'SUPER_ADMIN' ? TeamRole.SUPER_ADMIN : TeamRole.SALES_MANAGER);
    const cleanPhone = updated.phone.replace(/\D/g, '').slice(-10);

    return {
      id: updated.id,
      name: updated.name,
      email: updated.email,
      phone: cleanPhone,
      role: position,
      status: updated.accountStatus,
      joinedAt: updated.createdAt.toISOString(),
      updatedAt: updated.updatedAt.toISOString(),
    };
  }

  async deleteTeamMember(id: string) {
    const user = await this.prisma.db.user.findUnique({ where: { id } });
    if (!user) {
      return { success: true, message: 'Member already removed' };
    }

    const cleanPhone = user.phone.replace(/\D/g, '').slice(-10);
    if (cleanPhone === '7558969093' && user.role === 'SUPER_ADMIN') {
      throw new BadRequestException('Primary Super Admin cannot be deleted');
    }

    await this.prisma.db.user.delete({ where: { id } });
    return { success: true, message: 'Team member deleted successfully' };
  }
}
