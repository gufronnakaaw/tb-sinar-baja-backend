import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UsePipes,
} from '@nestjs/common';
import { SuccessResponse } from '../utils/global/global.response';
import { ZodValidationPipe } from '../utils/pipes/zod.pipe';
import {
  CreateMemberDto,
  MemberQuery,
  UpdateMemberDto,
  createMemberSchema,
  updateMemberSchema,
} from './member.dto';
import { MemberService } from './member.service';

@Controller('member')
export class MemberController {
  constructor(private readonly memberService: MemberService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async index(@Query() query: MemberQuery): Promise<SuccessResponse> {
    try {
      if (query.id_member) {
        return {
          success: true,
          status_code: HttpStatus.OK,
          data: await this.memberService.getMemberById(query.id_member),
        };
      }

      return {
        success: true,
        status_code: HttpStatus.OK,
        data: await this.memberService.getMember(),
      };
    } catch (error) {
      throw error;
    }
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ZodValidationPipe(createMemberSchema))
  async store(@Body() body: CreateMemberDto): Promise<SuccessResponse> {
    try {
      return {
        success: true,
        status_code: HttpStatus.CREATED,
        data: await this.memberService.createMember(body),
      };
    } catch (error) {
      throw error;
    }
  }

  @Patch()
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ZodValidationPipe(updateMemberSchema))
  async update(@Body() body: UpdateMemberDto): Promise<SuccessResponse> {
    try {
      return {
        success: true,
        status_code: HttpStatus.OK,
        data: await this.memberService.updateMember(body),
      };
    } catch (error) {
      throw error;
    }
  }

  @Delete(':id_member')
  @HttpCode(HttpStatus.OK)
  async destroy(
    @Param('id_member') id_member: string,
  ): Promise<SuccessResponse> {
    try {
      return {
        success: true,
        status_code: HttpStatus.OK,
        data: await this.memberService.deleteMember(id_member),
      };
    } catch (error) {
      throw error;
    }
  }
}
