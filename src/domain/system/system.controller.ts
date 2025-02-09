import { Controller, Post, Body } from '@nestjs/common';
import { SystemService } from './system.service';
import { VersionCheckRequestDto } from './dtos/check-version.dto';

@Controller('system')
export class SystemController {
  constructor(private readonly systemService: SystemService) {}

  @Post('check')
  checkVersion(@Body() versionCheckDto: VersionCheckRequestDto) {
    return this.systemService.checkVersion(versionCheckDto);
  }
}
