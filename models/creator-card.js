const { ModelSchema, SchemaTypes, DatabaseModel } = require('@app-core/mongoose');

const modelName = 'creator_cards';

const schemaConfig = {
  _id: { type: SchemaTypes.ULID, required: true },
  title: { type: SchemaTypes.String, index: true },
  description: { type: SchemaTypes.String },
  slug: { type: SchemaTypes.String, unique: true, index: true },
  creator_reference: { type: SchemaTypes.String, index: true },
  links: { type: SchemaTypes.Array, default: [] },
  service_rates: { type: SchemaTypes.Mixed, default: null },
  status: { type: SchemaTypes.String, index: true },
  access_type: { type: SchemaTypes.String, default: 'public', index: true },
  access_code: { type: SchemaTypes.String, default: null },
  created: { type: SchemaTypes.Number, required: true },
  updated: { type: SchemaTypes.Number, required: true },
};

const modelSchema = new ModelSchema(schemaConfig, { collection: modelName });

module.exports = DatabaseModel.model(modelName, modelSchema, { paranoid: true });
