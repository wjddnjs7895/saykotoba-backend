import { Controller, Post, Body } from '@nestjs/common';
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
}
