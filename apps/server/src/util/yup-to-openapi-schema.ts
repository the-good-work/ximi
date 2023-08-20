import { ApiBodyOptions } from '@nestjs/swagger';
import {
  Schema,
  SchemaDescription,
  SchemaFieldDescription,
  SchemaObjectDescription,
  SchemaRefDescription,
} from 'yup';

/*
  - [ ] mixed,
  - [x] string,
  - [x] number,
  - [x] boolean,
  - [x] bool,
  - [x] date,
  - [x] object,
  - [ ] array,
  - [-] ref,
  - [-] lazy,
 * */

const parseNode: (
  s: SchemaDescription | SchemaFieldDescription | SchemaRefDescription,
) => unknown = (s) => {
  switch (s.type) {
    case 'object': {
      const _s: SchemaObjectDescription = { ...s } as SchemaObjectDescription;
      return {
        type: 'object',

        properties: Object.keys(_s.fields).reduce(
          (p: Record<string, ApiBodyOptions>, c) => {
            p[c] = parseNode(_s.fields[c]);
            return p;
          },
          {},
        ),

        required: Object.keys(_s.fields).filter((k) => {
          const prop = _s.fields[k];
          if (prop.hasOwnProperty('optional')) {
            return (prop as SchemaDescription).optional === false;
          } else {
            return false;
          }
        }),
      };
    }

    case 'string': {
      return { type: 'string' };
    }

    case 'date': {
      return { type: 'string', format: 'date-time' };
    }

    case 'number': {
      return { type: 'number' };
    }

    case 'boolean':
    case 'bool': {
      return { type: 'boolean' };
    }

    case 'ref': {
      console.warn('Yup schema refs are not supported. Casting as AnyValue.');
      return {};
    }

    case 'lazy': {
      console.warn('Yup lazy schemas are not supported. Casting as AnyValue. ');
      return {};
    }

    default: {
      console.log('handle this:');
      console.log(s);
    }
  }
};

export const yupToOpenAPISchema: (yupSchema: Schema) => ApiBodyOptions = (
  yupSchema,
) => {
  const schemaDescription = yupSchema.describe();
  return { schema: parseNode(schemaDescription) };
};
