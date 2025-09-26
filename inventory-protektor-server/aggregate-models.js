const fs = require('fs');
const path = require('path');

function aggregateModels(data) {
  const modelMap = new Map();

  data.forEach((order) => {
    order.products.forEach((product) => {
      modelMap.set(
        product.model,
        (modelMap.get(product.model) || 0) + product.quantity,
      );
    });
  });

  return modelMap;
}

function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.error(
      'Uso: node aggregate-models.js <archivo-json> [--format=<json|csv|table>]',
    );
    process.exit(1);
  }

  const filePath = path.resolve(args[0]);
  let format = 'table';

  // Procesar opciones
  if (args.length > 1) {
    const formatMatch = args[1].match(/--format=(json|csv|table)/);
    if (formatMatch) {
      format = formatMatch[1];
    }
  }

  try {
    const rawData = fs.readFileSync(filePath, 'utf8');
    const jsonData = JSON.parse(rawData);

    if (!jsonData.data || !Array.isArray(jsonData.data)) {
      throw new Error(
        'Estructura JSON inválida. Se espera propiedad "data" con array de órdenes.',
      );
    }

    const result = aggregateModels(jsonData.data);

    // Mostrar en el formato solicitado
    switch (format) {
      case 'json':
        const jsonResult = {};
        result.forEach((value, key) => {
          jsonResult[key] = value;
        });
        console.log(JSON.stringify(jsonResult, null, 2));
        break;

      case 'csv':
        console.log('Modelo,Cantidad');
        result.forEach((value, key) => {
          console.log(`"${key}",${value}`);
        });
        break;

      case 'table':
      default:
        console.log('=== CANTIDAD TOTAL POR MODELO ===');
        console.log('Modelo\t\t\tCantidad');
        console.log('===============================');
        result.forEach((value, key) => {
          // Ajustar tabulaciones según la longitud del nombre del modelo
          const tab = key.length > 11 ? '\t' : '\t\t';
          console.log(`${key}${tab}${value}`);
        });
        break;
    }
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

main();
