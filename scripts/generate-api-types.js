#!/usr/bin/env node

/**
 * Script to generate TypeScript types from OpenAPI/Swagger specification
 * Usage: npm run generate:types [swagger-url]
 *
 * Example:
 * npm run generate:types https://api.lotusdharm.com/swagger/v1/swagger.json
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const { execSync } = require('child_process');

// Configuration
const CONFIG = {
  outputDir: path.join(__dirname, '..', 'lib', 'api', 'types'),
  tempFile: path.join(__dirname, '..', 'temp-swagger.json'),
  openapiGenerator: 'openapi-typescript', // or 'orval'
};

// Ensure output directory exists
if (!fs.existsSync(CONFIG.outputDir)) {
  fs.mkdirSync(CONFIG.outputDir, { recursive: true });
}

// Get swagger URL from command line or environment
const swaggerUrl = process.argv[2] || process.env.SWAGGER_URL;

// Check if it's a test run with sample data
const isTestRun = process.argv.includes('--test') || process.env.NODE_ENV === 'test';

if (!swaggerUrl && !isTestRun) {
  console.error('❌ Error: Swagger URL is required');
  console.log('Usage: npm run generate:types <swagger-url>');
  console.log('Or set SWAGGER_URL environment variable');
  console.log('');
  console.log('For testing: npm run generate:types --test');
  process.exit(1);
}

console.log('🚀 Generating API types from:', swaggerUrl);

// Download Swagger JSON
function downloadSwaggerJson(url) {
  return new Promise((resolve, reject) => {
    console.log('📥 Downloading Swagger specification...');

    const request = https.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download: ${response.statusCode} ${response.statusMessage}`));
        return;
      }

      let data = '';
      response.on('data', (chunk) => {
        data += chunk;
      });

      response.on('end', () => {
        try {
          const json = JSON.parse(data);
          fs.writeFileSync(CONFIG.tempFile, JSON.stringify(json, null, 2));
          console.log('✅ Swagger JSON downloaded successfully');
          resolve(json);
        } catch (error) {
          reject(new Error(`Failed to parse JSON: ${error.message}`));
        }
      });
    });

    request.on('error', (error) => {
      reject(new Error(`Download failed: ${error.message}`));
    });

    request.setTimeout(30000, () => {
      request.destroy();
      reject(new Error('Download timeout'));
    });
  });
}

// Generate TypeScript types using openapi-typescript
async function generateTypes() {
  try {
    console.log('🔄 Generating TypeScript types...');

    // Check if openapi-typescript is installed
    try {
      execSync('npx openapi-typescript --version', { stdio: 'ignore' });
    } catch (error) {
      console.log('📦 Installing openapi-typescript...');
      execSync('npm install --save-dev openapi-typescript', { stdio: 'inherit' });
    }

    // Generate types
    const outputFile = path.join(CONFIG.outputDir, 'generated.ts');
    execSync(
      `npx openapi-typescript ${CONFIG.tempFile} --output ${outputFile} --export-type`,
      { stdio: 'inherit' }
    );

    console.log('✅ TypeScript types generated successfully');

    // Create index file for easier imports
    const indexContent = `// Auto-generated API types from OpenAPI spec
// Generated on: ${new Date().toISOString()}
// Source: ${swaggerUrl}

export * from './generated';
export * from './common';
`;

    fs.writeFileSync(path.join(CONFIG.outputDir, 'index.ts'), indexContent);
    console.log('✅ Type index file created');

  } catch (error) {
    console.error('❌ Failed to generate types:', error.message);
    throw error;
  }
}

// Generate enhanced types with better naming
function generateEnhancedTypes(swaggerJson) {
  console.log('🔧 Generating enhanced type definitions...');

  const enhancedTypes = [];

  // Generate request/response types for each endpoint
  if (swaggerJson.paths) {
    for (const [path, methods] of Object.entries(swaggerJson.paths)) {
      for (const [method, spec] of Object.entries(methods)) {
        if (spec && typeof spec === 'object' && 'operationId' in spec) {
          const operationId = spec.operationId;
          const requestType = `${operationId}Request`;
          const responseType = `${operationId}Response`;

          enhancedTypes.push(`
// ${spec.summary || operationId}
export type ${requestType} = ${generateRequestType(spec)};
export type ${responseType} = ${generateResponseType(spec)};
`);
        }
      }
    }
  }

  const enhancedFile = path.join(CONFIG.outputDir, 'enhanced.ts');
  const content = `// Enhanced API types with better naming conventions
// Auto-generated from OpenAPI spec

import type * as Generated from './generated';

${enhancedTypes.join('\n')}
`;

  fs.writeFileSync(enhancedFile, content);
  console.log('✅ Enhanced types generated');
}

// Helper functions for type generation
function generateRequestType(operationSpec) {
  // This is a simplified implementation
  // In a real scenario, you'd parse the requestBody schema
  return 'Record<string, any>'; // Placeholder
}

function generateResponseType(operationSpec) {
  // This is a simplified implementation
  // In a real scenario, you'd parse the responses schema
  return 'Record<string, any>'; // Placeholder
}

// Clean up temporary files
function cleanup() {
  if (fs.existsSync(CONFIG.tempFile)) {
    fs.unlinkSync(CONFIG.tempFile);
    console.log('🧹 Cleaned up temporary files');
  }
}

// Main execution
async function main() {
  try {
    console.log('🏁 Starting API type generation...');

    let swaggerJson;

    if (isTestRun) {
      console.log('🧪 Using sample Swagger data for testing...');
      const sampleFile = path.join(__dirname, 'sample-swagger.json');
      if (!fs.existsSync(sampleFile)) {
        throw new Error('Sample Swagger file not found: scripts/sample-swagger.json');
      }
      const sampleData = fs.readFileSync(sampleFile, 'utf8');
      swaggerJson = JSON.parse(sampleData);
    } else {
      swaggerJson = await downloadSwaggerJson(swaggerUrl);
    }

    await generateTypes();
    generateEnhancedTypes(swaggerJson);

    cleanup();

    console.log('🎉 API type generation completed successfully!');
    console.log('📁 Generated files:');
    console.log('   - lib/api/types/generated.ts');
    console.log('   - lib/api/types/enhanced.ts');
    console.log('   - lib/api/types/index.ts');
    console.log('');
    console.log('🔗 Next steps:');
    console.log('   1. Replace sample types with real API types');
    console.log('   2. Update API endpoints in lib/api/data.ts');
    console.log('   3. Test API integration');

  } catch (error) {
    console.error('💥 API type generation failed:', error);
    cleanup();
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { generateTypes, downloadSwaggerJson };