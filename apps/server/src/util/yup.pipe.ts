import { Injectable, PipeTransform, BadRequestException } from '@nestjs/common';
import * as Yup from 'yup';

@Injectable()
class YupValidationPipe implements PipeTransform {
  constructor(private schema: Yup.Schema<any>) {}
  async transform(value: unknown) {
    try {
      await this.schema.validate(value);
      return value;
    } catch (error) {
      throw new BadRequestException(error.errors, {
        cause: error,
      });
    }
  }
}

export { YupValidationPipe };
