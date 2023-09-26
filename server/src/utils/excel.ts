export const createSheetHeader = (workbook, sheet) => {
  const headerStyle = workbook.createStyle({
    font: { bold: true, size: 17 },
    fill: { type: "pattern", patternType: "solid", fgColor: "#F39C12" },
  });
  const warningStyle = workbook.createStyle({
    font: { bold: true, size: 17 },
    fill: { type: "pattern", patternType: "solid", fgColor: "#E74C3C" },
  });
  sheet.column(1).setWidth(5);
  sheet.column(2).setWidth(40);
  sheet.column(3).setWidth(40);
  sheet.column(4).setWidth(40);
  sheet.column(5).setWidth(50);
  sheet.cell(1, 1).string("*ID").style(warningStyle);
  sheet.cell(1, 2).string("Ürün İsmi").style(headerStyle);
  sheet.cell(1, 3).string("Ürün Açıklaması").style(headerStyle);
  sheet.cell(1, 4).string("Ürün Fiyatı").style(headerStyle);
  sheet.cell(1, 5).string("UYARI: Başında yıldız olan bölümlere dokunmayınız").style(warningStyle);
};

export const fillProductsToExcel = (products, sheet) => {
  products.forEach((product: any, index) => {
    const row = index + 2;
    sheet.cell(row, 1).string(product._id.toString());
    sheet.cell(row, 2).string(product.name);
    sheet.cell(row, 3).string(product.description);
    sheet.cell(row, 4).number(product.price);
  });
};

export const getProductsFromExcel = (rows) => {
  const productsNeedUpdate: any = [];
  const newProducts: any = [];
  rows.shift();
  rows.forEach((row: any) => {
    const product = {
      _id: row[0],
      name: row[1],
      description: row[2],
      price: row[3],
    };
    if (product._id) {
      return productsNeedUpdate.push(product);
    }
    newProducts.push(product);
  });
  return { productsNeedUpdate, newProducts };
};
