import { delay, filter, Observable } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { TableService } from './service/table.service';
import { DataModel } from 'src/shared/data.model';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
export class TableComponent implements OnInit {
  columns: any = [
    {
      propName: 'wbRating',
      colName: 'WB Рейтинг',
    },
    {
      propName: 'reviewsCount',
      colName: 'Кол-во отзывов',
    },
    {
      propName: 'nomenclature',
      colName: 'Номенклатура',
    },
    {
      propName: 'sku',
      colName: 'SKU',
    },
    {
      propName: 'name',
      colName: 'Имя',
    },
    {
      propName: 'brandName',
      colName: 'Название бренда',
    },
    {
      propName: 'ordered',
      colName: 'Кол-во заказов',
    },
    {
      propName: 'soldQuantity',
      colName: 'Кол-во продаж',
    },
    {
      propName: 'soldAmount',
      colName: 'Продано на сумму',
    },
    {
      propName: 'orderedAmount',
      colName: 'Сумма заказа',
    },
    {
      propName: 'availability',
      colName: 'Доступность',
    },
  ];

  tableData: DataModel[] = [];
  tableCurrentPage: DataModel[] = [];

  rowsOnTablePage = 5;

  isLoading = false;
  sortReverse = false;
  filtered = false;

  paginationItems: number[] = [];
  activePaginationItem: number = 1;

  formTableFilter: FormGroup = new FormGroup({
    name: new FormControl(''),
    reviewsCountMin: new FormControl(''),
    reviewsCountMax: new FormControl(''),
  });

  constructor(private tableService: TableService) {}

  ngOnInit(): void {}

  loadTableData() {
    this.isLoading = true;
    this.tableService
      .getItems()
      .pipe(delay(600))
      .subscribe((data) => {
        this.initTableWithPagination(data);
        this.isLoading = false;
      });
  }

  initTableWithPagination(data: DataModel[]) {
    this.tableData = data;
    this.setItemTableCurrentPage(0);
    if (this.tableData.length > 5) {
      for (let i = 0; this.tableData.length / this.rowsOnTablePage > i; i++) {
        this.paginationItems.push(i);
      }
    }
  }

  setItemTableCurrentPage(startIndex: number) {
    this.tableCurrentPage = this.tableData.slice(
      startIndex,
      startIndex + this.rowsOnTablePage
    );
  }

  sort(property: string) {
    let compare = (a: any, b: any) =>
      b[property] > a[property]
        ? this.sortReverse
          ? 1
          : -1
        : !this.sortReverse
        ? 1
        : -1;
    this.tableCurrentPage.sort(compare);
  }

  resetFilter() {
    this.setItemTableCurrentPage(0);
    this.filtered = false;
    this.formTableFilter.controls['reviewsCountMin'].setValue('');
    this.formTableFilter.controls['reviewsCountMax'].setValue('');
    this.formTableFilter.controls['name'].setValue('');
  }

  tableFilter() {
    let context = this;
    function filterParams(item: any) {
      return (
        item.name.includes(context.formTableFilter.controls['name'].value) &&
        (context.formTableFilter.controls['reviewsCountMin'].value !== ''
          ? item.reviewsCount >
            context.formTableFilter.controls['reviewsCountMin'].value
          : true) &&
        (context.formTableFilter.controls['reviewsCountMax'].value !== ''
          ? item.reviewsCount <
            context.formTableFilter.controls['reviewsCountMax'].value
          : true)
      );
    }
    this.tableCurrentPage = this.tableData.filter(filterParams);
    this.filtered = true;
  }
}
