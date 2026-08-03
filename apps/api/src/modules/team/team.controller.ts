import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';

import { InviteTeamMemberDto, UpdateTeamMemberDto } from './dto/team.dto';
import { TeamService } from './team.service';

@Controller('admin/team')
export class TeamController {
  constructor(private readonly teamService: TeamService) {}

  @Get()
  async getTeam() {
    return this.teamService.getAllTeamMembers();
  }

  @Post()
  async inviteMember(@Body() dto: InviteTeamMemberDto) {
    return this.teamService.inviteTeamMember(dto);
  }

  @Patch(':id')
  async updateMember(@Param('id') id: string, @Body() dto: UpdateTeamMemberDto) {
    return this.teamService.updateTeamMember(id, dto);
  }

  @Delete(':id')
  async deleteMember(@Param('id') id: string) {
    return this.teamService.deleteTeamMember(id);
  }
}
