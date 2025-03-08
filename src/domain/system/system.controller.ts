import { Controller, Post, Body, Get } from '@nestjs/common';
import { SystemService } from './system.service';
import { VersionCheckRequestDto } from './dtos/check-version.dto';
import { Public } from '@/common/decorators/public.decorator';
import { LogParams } from '@/common/decorators/log-params.decorator';
@Controller('system')
export class SystemController {
  constructor(private readonly systemService: SystemService) {}

  @Public()
  @Post('check-version')
  @LogParams()
  checkVersion(@Body() versionCheckDto: VersionCheckRequestDto) {
    return this.systemService.checkVersion(versionCheckDto);
  }

  @Public()
  @Get('terms-of-use')
  getTermsOfUse(): { url: string } {
    return this.systemService.getTermsOfUse();
  }

  @Public()
  @Get('privacy-policy')
  getPrivacyPolicy(): { url: string } {
    return this.systemService.getPrivacyPolicy();
  }
}
