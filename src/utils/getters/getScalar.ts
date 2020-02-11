import {SchemaObject} from 'openapi3-ts';
import {getArray} from './getArray';
import {getObject} from './getObject';

/**
 * Return the typescript equivalent of open-api data type
 *
 * @param item
 * @ref https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.1.md#data-types
 */
export const getScalar = (item: SchemaObject) => {
  const nullable = item.nullable ? ' | null' : '';

  switch (item.type) {
    case 'int32':
    case 'int64':
    case 'number':
    case 'integer':
    case 'long':
    case 'float':
    case 'double':
      return {value: 'number' + nullable};

    case 'boolean':
      return {value: 'boolean' + nullable};

    case 'array': {
      const {value, imports} = getArray(item);
      return {value: value + nullable, imports};
    }

    case 'string':
    case 'byte':
    case 'binary':
    case 'date':
    case 'dateTime':
    case 'date-time':
    case 'password': {
      let value = 'string';
      let isEnum = false;

      if (item.enum) {
        value = `'${item.enum.join(`' | '`)}'`;
        isEnum = true;
      }

      if (item.format === 'binary') {
        value = 'BlobPart';
      }

      return {value: value + nullable, isEnum};
    }

    case 'object':
    default: {
      const {value, imports} = getObject(item);
      return {value: value + nullable, imports};
    }
  }
};
