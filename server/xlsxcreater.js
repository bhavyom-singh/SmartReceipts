import ExcelJS from "exceljs";
import fs from "node:fs";

const excel_writer = async (data_object) => {
  const filename = generateFileName();
  await checkXlxsFolderExits("./xlxsFiles");
  const generatedFilePath = "./xlxsFiles/" + filename;
  const workbook = new ExcelJS.Workbook();
  workbook.created = new Date(1985, 8, 30);
  workbook.properties.date1904 = true;
  workbook.calcProperties.fullCalcOnLoad = true;
  workbook.views = [
    {
      x: 0,
      y: 0,
      width: 10000,
      height: 20000,
      firstSheet: 0,
      activeTab: 0,
      visibility: "visible",
    },
  ];
  let sheet_count = 0;
  let row_count = 0;
  data_object.forEach((element) => {
    const worksheet = workbook.addWorksheet(sheet_count.toString());
    if (sheet_count == 0) {
      worksheet.columns = [
        { header: "Category Name", key: "name", width: 40 },
        { header: "Percentage", key: "percentage", width: 10 },
      ];
    } else {
      worksheet.columns = [
        { header: "Item Name", key: "name", width: 40 },
        { header: "Price", key: "price", width: 10 },
      ];
    }
    let cell_name = worksheet.getCell("A1");
    cell_name.font = { bold: true };
    let cell_pr = worksheet.getCell("B1");
    cell_pr.font = { bold: true };
    element.forEach((row) => {
      worksheet.addRow(row);
      row_count++;
    });

    sheet_count++;
  });
  await workbook.xlsx.writeFile(generatedFilePath);
  return filename;
};

const generateFileName = () => {
  const dateTime = Date.now().toString();
  const filename = "GroceryList_" + dateTime + ".xlsx";
  return filename;
};

const checkXlxsFolderExits = async (folderName) => {
  fs.mkdir(folderName, { recursive: true }, (err) => {
    if (err) {
      // perform some operation if error occured
    } else {
      // perform some operation if no error occured
    }
  });
};

export default excel_writer;
