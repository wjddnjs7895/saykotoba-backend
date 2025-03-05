import { Controller, Post, Body, Get } from '@nestjs/common';
import { SystemService } from './system.service';
import { VersionCheckRequestDto } from './dtos/check-version.dto';
import { Public } from '@/common/decorators/public.decorator';

@Controller('system')
export class SystemController {
  constructor(private readonly systemService: SystemService) {}

  @Public()
  @Post('check-version')
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
