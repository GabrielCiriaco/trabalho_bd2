import {
  Component,
  HostListener,
  OnInit,
  ViewChild,
  AfterViewInit,
  ViewChildren,
  QueryList,
  ElementRef,
} from '@angular/core';
import { Observable, map, startWith } from 'rxjs';
import { ValidationErrors, AbstractControl, ValidatorFn } from '@angular/forms';
import { FormControl, FormGroup } from '@angular/forms';
import Swal from 'sweetalert2';
import { Color, ECharts } from 'echarts';
import { jsPDF } from 'jspdf';
import * as echarts from 'echarts/core';
import html2canvas from 'html2canvas';

import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

import { EventoService } from 'src/app/core/services/evento.service';
import { EspacoService } from 'src/app/core/services/espaco.service';
import { ClasEtariaService } from 'src/app/core/services/clas-etaria.service';

import { APIReturns } from 'src/app/core/model/APIReturns';
import { MatAutocomplete } from '@angular/material/autocomplete';
import { DoughnutChartComponent } from 'src/app/shared/echarts/doughnut-chart/doughnut-chart.component';
import { DataAdminService } from 'src/app/core/services/data-admin.service';
import { ProprietarioEspacoService } from 'src/app/core/services/proprietario-espaco.service';
import { ProprietarioEventoService } from 'src/app/core/services/proprietario-evento.service';
import { ProprietarioProjetoService } from 'src/app/core/services/proprietario-projeto.service';

interface filterSelected {
  evento: string;
  espaco: string;
  clasEtaria: string;
  donoEspaco: string;
  donoEvento: string;
  donoProjeto: string;
  dataInicial: any;
  dataFinal: any;
}

interface chartData {
  dataURL: string;
  imgWidth: number;
  imgHeight: number;
}

@Component({
  selector: 'app-usuario-produtor',
  templateUrl: './usuario-produtor.component.html',
  styleUrls: ['./usuario-produtor.component.scss'],
})
export class UsuarioProdutorComponent implements OnInit, AfterViewInit {
  length = 0;
  pageIndex = 1;
  pageEvent: PageEvent = <any>{};

  // data dos gráficos
  dataEvento = [];
  dataEspaco = [];
  dataClasEtaria = [];
  dataDonoEspaco = [];
  dataDonoEvento = [];
  dataDonoProjeto = [];

  dataSentimento = [];
  dataMidia = [];
  dataVeiculo = [];
  dataSentimentoCategoria = [];

  dataTabela = <any>[];
  paginaAtual = 1;
  rowsPerPage = 10;
  ultimaPagina = 1;

  colorSentimento = <any>[];
  colorMidia = <any>[];
  quantidade = [1, 2, 3, 4];

  filterSelected: filterSelected = {} as filterSelected;
  isTelaMenorQue500px: number = 5;
  nubergraphs: number = 2;
  chipShow = <any>[];
  minDate = <Date>{};
  maxDate = new Date();
  todayDate = new Date();
  ninetyDaysAgo = new Date(new Date().setDate(this.todayDate.getDate() - 90));

  filterForm = new FormGroup({
    eventos: new FormControl('', [this.validateWordEventos()]),
    espacos: new FormControl('', [this.validateWordEspacos()]),
    clasEtarias: new FormControl('', [this.validateWordClasEtarias()]),
    donoEspacos: new FormControl('', [this.validateWordEspacos()]),
    donoEventos: new FormControl('', [this.validateWordEventos()]),
    donoProjetos: new FormControl('', [this.validateWordEventos()]),

    dataInicial: new FormControl<Date | null>(this.ninetyDaysAgo),
    dataFinal: new FormControl<Date | null>(this.todayDate),
  });

  // arrays de opçoes para os filtros ---------------------

  eventos: Array<APIReturns> = [];
  espacos: Array<APIReturns> = [];
  clasesEtarias: Array<APIReturns> = [];
  donoEspacos: Array<APIReturns> = [];
  donoEventos: Array<APIReturns> = [];
  donoProjetos: Array<APIReturns> = [];

  // variaveis para filtragem de filtros para os filtros ---------------------
  filteredOptionsEventos?: Observable<APIReturns[]>;
  filteredOptionsEspacos?: Observable<APIReturns[]>;
  filteredOptionsClasesEtarias?: Observable<APIReturns[]>;
  filteredOptionsDonoEspacos?: Observable<APIReturns[]>;
  filteredOptionsDonoEventos?: Observable<APIReturns[]>;
  filteredOptionsDonoProjetos?: Observable<APIReturns[]>;

  @ViewChild('completeEvento') completeEvento: MatAutocomplete = <any>{};
  @ViewChild('completeEspaco') completeEspaco: MatAutocomplete = <any>{};
  @ViewChild('completeDonoEspaco') completeDonoEspaco: MatAutocomplete = <
    any
  >{};

  @ViewChild('completeDonoEvento') completeDonoEvento: MatAutocomplete = <
    any
  >{};

  @ViewChild('completeDonoProjeto') completeDonoProjeto: MatAutocomplete = <
    any
  >{};

  @ViewChild('completeClasEtaria') completeClasEtaria: MatAutocomplete = <
    any
  >{};

  displayedColumns: string[] = [
    'id',
    'datapubli',
    'grupo',
    'empresa',
    'midia',
    'veiculo',
    'programa',
    'categoria',
    'subcategoria',
    'sentimento',
    'titulo',
    'arquivo',
  ];
  dataSource: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator: MatPaginator = <any>{};
  @ViewChild(MatSort) sort: MatSort = <any>{};

  @ViewChildren('qualquer') charts: QueryList<any> = <any>[];
  @ViewChild('dashboard') dashboard!: ElementRef;

  chartData: chartData = <any>{};

  constructor(
    private eventoService: EventoService,
    private espacoService: EspacoService,
    private clasEtariaService: ClasEtariaService,
    private proprietarioEspacoService: ProprietarioEspacoService,
    private proprietarioEventoService: ProprietarioEventoService,
    private proprietarioProjetoService: ProprietarioProjetoService,

    private dataAdminService: DataAdminService
  ) {
    // Assign the data to the data source for the table to render
    this.dataSource = new MatTableDataSource(this.dataTabela);
  }

  ngAfterViewInit() {
    //this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  ngOnInit(): void {
    this.setDate(this.filterForm.controls.dataInicial.value);
    this.setDate(this.filterForm.controls.dataFinal.value);
    this.showchips();
    var request = this.criarStringRequest();

    this.onResize();

    Swal.fire({
      background: '#ffffff00',
      timerProgressBar: true,
      showConfirmButton: false,
      allowOutsideClick: false,
      didOpen: async () => {
        Swal.showLoading();
        try {
          await Promise.all([
            this.listar_eventos(),
            this.listar_espacos(),
            this.listar_clasEtarias(),
            this.listar_donoEspacos(),
            this.listar_donoEventos(),
            this.listar_donoProjetos(),

            new Promise((resolve, reject) => {
              this.dataAdminService.noticiaPorSentimento(request).subscribe({
                next: (value) => {
                  this.dataSentimento = value;
                  this.colorSentimento = this.setColorSentimento(
                    this.dataSentimento
                  );
                  resolve(true);
                },
                error: (error) => {
                  reject(true);
                },
              });
            }),
            new Promise((resolve, reject) => {
              this.dataAdminService.noticiaPorMidia(request).subscribe({
                next: (value) => {
                  this.dataMidia = value;
                  this.colorMidia = this.setColorMidia(this.dataMidia);
                  resolve(true);
                },
                error: (error) => {
                  reject(true);
                },
              });
            }),
            new Promise((resolve, reject) => {
              this.dataAdminService.noticiaPorVeiculo(request).subscribe({
                next: (value) => {
                  this.dataVeiculo = value;
                  resolve(true);
                },
                error: (error) => {
                  reject(true);
                },
              });
            }),
            new Promise((resolve, reject) => {
              this.dataAdminService.sentimentoPorCategoria(request).subscribe({
                next: (value) => {
                  this.dataSentimentoCategoria = value;
                  resolve(true);
                },
                error: (error) => {
                  reject(true);
                },
              });
            }),
            new Promise((resolve, reject) => {
              this.dataAdminService
                .listarTabela(
                  `1?page=1&per_page=${
                    this.rowsPerPage
                  }&${this.criarStringRequest()}`
                )
                .subscribe({
                  next: (value) => {
                    this.dataTabela = value.records;
                    this.length = value._metadata.total_count;
                    this.dataSource = new MatTableDataSource(this.dataTabela);
                    this.ultimaPagina = value._metadata.total_pages;
                    resolve(true);
                  },
                  error: (error) => {
                    reject(true);
                  },
                });
            }),
          ]);
          Swal.close();
        } catch (error) {
          Swal.fire({
            icon: 'error',
            title: 'houve um erro ao carregar os filtros',
            text: 'Por favor, tente novamente.',
            confirmButtonColor: 'orange',
          });
          Swal.close();
        }
      },
    });
  }

  //----------------------------- Responsividade dos filtros ------------------------------------
  @HostListener('window:resize', ['$event'])
  onResize(): void {
    if (window.innerWidth < 600) {
      this.isTelaMenorQue500px = 1;
      this.nubergraphs = 1;
    } else if (window.innerWidth < 850) {
      this.isTelaMenorQue500px = 3;
      this.nubergraphs = 2;
    } else {
      this.isTelaMenorQue500px = 5;
      this.nubergraphs = 2;
    }
  }

  // ------------------------------ exibir e esconder os chips ---------------------------------------
  hidechips() {
    this.chipShow = [];
  }

  showchips() {
    this.chipShow = [];

    if (
      this.filterForm.controls.eventos.value != '' &&
      this.filterForm.controls.eventos.value != null &&
      this.filterForm.get('eventos')?.errors?.['invalidWord'] != true
    )
      this.chipShow.push(this.filterForm.controls.eventos.value);

    if (
      this.filterForm.controls.espacos.value != '' &&
      this.filterForm.controls.espacos.value != null &&
      this.filterForm.get('espacos')?.errors?.['invalidWord'] != true
    )
      this.chipShow.push(this.filterForm.controls.espacos.value);

    if (
      this.filterForm.controls.clasEtarias.value != '' &&
      this.filterForm.controls.clasEtarias.value != null &&
      this.filterForm.get('clasEtarias')?.errors?.['invalidWord'] != true
    )
      this.chipShow.push(this.filterForm.controls.clasEtarias.value);

    if (
      this.filterForm.controls.donoEspacos.value != '' &&
      this.filterForm.controls.donoEspacos.value != null &&
      this.filterForm.get('donoEspacos')?.errors?.['invalidWord'] != true
    )
      this.chipShow.push(this.filterForm.controls.donoEspacos.value);

    if (
      this.filterForm.controls.donoEventos.value != '' &&
      this.filterForm.controls.donoEventos.value != null &&
      this.filterForm.get('donoEventos')?.errors?.['invalidWord'] != true
    )
      this.chipShow.push(this.filterForm.controls.donoEventos.value);

    if (
      this.filterForm.controls.donoProjetos.value != '' &&
      this.filterForm.controls.donoProjetos.value != null &&
      this.filterForm.get('donoProjetos')?.errors?.['invalidWord'] != true
    )
      this.chipShow.push(this.filterForm.controls.donoProjetos.value);

    if (this.filterForm.controls.dataInicial.value != null) {
      let datainicial = this.filterForm.controls.dataInicial.value;
      this.chipShow.push(
        `${datainicial.getDate()}/${
          datainicial.getMonth() + 1
        }/${datainicial.getFullYear()}`
      );
    }

    if (this.filterForm.controls.dataFinal.value != null) {
      let datafinal = this.filterForm.controls.dataFinal.value;
      this.chipShow.push(
        `${datafinal.getDate()}/${
          datafinal.getMonth() + 1
        }/${datafinal.getFullYear()}`
      );
    }
  }

  // ------------------------------ funçoes relacionadas aos filtros -----------------------
  setDate(dateObject: any) {
    const datainicial = this.filterForm.controls.dataInicial.value;
    const datafinal = this.filterForm.controls.dataFinal.value;
    if (datainicial != null) {
      this.minDate = new Date(
        datainicial.getFullYear(),
        datainicial.getMonth(),
        datainicial.getDate()
      );
      this.filterSelected.dataInicial = `${datainicial.getFullYear()}-${
        datainicial.getMonth() + 1
      }-${datainicial.getDate()}`;
    }

    if (datafinal != null) {
      this.maxDate = new Date(
        datafinal.getFullYear(),
        datafinal.getMonth(),
        datafinal.getDate()
      );
      this.filterSelected.dataFinal = `${datafinal.getFullYear()}-${
        datafinal.getMonth() + 1
      }-${datafinal.getDate()}`;
    }
  }

  validForm() {
    if (
      !this.filterForm.get('eventos')?.errors?.['invalidWord'] &&
      !this.filterForm.get('espacos')?.errors?.['invalidWord'] &&
      !this.filterForm.get('clasEtarias')?.errors?.['invalidWord'] &&
      !this.filterForm.get('donoEspacos')?.errors?.['invalidWord'] &&
      !this.filterForm.get('donoEventos')?.errors?.['invalidWord'] &&
      !this.filterForm.get('donoProjetos')?.errors?.['invalidWord']
    ) {
      return true;
    } else {
      return false;
    }
  }

  validClearFilter() {
    if (
      (this.filterForm.controls.eventos.value == '' ||
        this.filterForm.controls.eventos.value == null) &&
      (this.filterForm.controls.espacos.value == '' ||
        this.filterForm.controls.espacos.value == null) &&
      (this.filterForm.controls.clasEtarias.value == '' ||
        this.filterForm.controls.clasEtarias.value == null) &&
      (this.filterForm.controls.donoEspacos.value == '' ||
        this.filterForm.controls.donoEspacos.value == null) &&
      (this.filterForm.controls.donoEventos.value == '' ||
        this.filterForm.controls.donoEventos.value == null) &&
      (this.filterForm.controls.donoProjetos.value == '' ||
        this.filterForm.controls.donoProjetos.value == null) &&
      this.filterForm.controls.dataInicial.value == this.ninetyDaysAgo &&
      this.filterForm.controls.dataFinal.value == this.todayDate
    ) {
      return true;
    } else {
      return false;
    }
  }

  limparFiltros() {
    this.filterSelected = {} as filterSelected;

    this.minDate = <Date>{};
    this.maxDate = new Date();

    this.filterForm.controls.eventos.setValue(null);
    this.filterForm.controls.espacos.setValue(null);
    this.filterForm.controls.clasEtarias.setValue(null);
    this.filterForm.controls.donoEspacos.setValue(null);
    this.filterForm.controls.donoEventos.setValue(null);
    this.filterForm.controls.donoProjetos.setValue(null);

    this.filterForm.controls.dataInicial.setValue(this.ninetyDaysAgo);
    this.filterForm.controls.dataFinal.setValue(this.todayDate);

    this.setDate(this.filterForm.controls.dataInicial.value);
    this.setDate(this.filterForm.controls.dataFinal.value);

    this.completeEvento.options.forEach((element) => {
      element.deselect();
    });
    this.completeEspaco.options.forEach((element) => {
      element.deselect();
    });
    this.completeClasEtaria.options.forEach((element) => {
      element.deselect();
    });
    this.completeDonoEspaco.options.forEach((element) => {
      element.deselect();
    });
    this.completeDonoEvento.options.forEach((element) => {
      element.deselect();
    });
    this.completeDonoProjeto.options.forEach((element) => {
      element.deselect();
    });

    this.filtrar();
  }

  criarStringRequest() {
    var request: string = '';
    if (this.filterSelected.evento != undefined)
      request = request.concat(`id_evento=${this.filterSelected.evento}&`);

    if (this.filterSelected.espaco != undefined)
      request = request.concat(`id_espaco=${this.filterSelected.espaco}&`);

    if (this.filterSelected.clasEtaria != undefined)
      request = request.concat(
        `id_clas_etaria=${this.filterSelected.clasEtaria}&`
      );

    if (this.filterSelected.donoEspaco != undefined)
      request = request.concat(
        `id_dono_espaco=${this.filterSelected.donoEspaco}&`
      );

    if (this.filterSelected.donoEvento != undefined)
      request = request.concat(
        `id_dono_evento=${this.filterSelected.donoEvento}&`
      );

    if (this.filterSelected.donoProjeto != undefined)
      request = request.concat(
        `id_dono_projeto=${this.filterSelected.donoProjeto}&`
      );

    if (this.filterSelected.dataInicial != undefined)
      request = request.concat(
        `data_inicio=${this.filterSelected.dataInicial}&`
      );
    if (this.filterSelected.dataFinal != undefined)
      request = request.concat(`data_fim=${this.filterSelected.dataFinal}&`);

    // Remover o último '&', se existir
    if (request.endsWith('&')) {
      request = request.slice(0, -1);
    }
    return request;
  }

  filtrar() {
    this.showchips();
    var request = this.criarStringRequest();

    // Swal.fire({
    //   background: '#ffffff00',
    //   showConfirmButton: false,
    //   didOpen: async () => {
    //     Swal.showLoading();
    //     try {
    //       await Promise.all([
    //         new Promise((resolve, reject) => {
    //           this.dataAdminService
    //             .noticiaPorSentimento(request)
    //             .subscribe({
    //               next: (value) => {
    //                 console.log('passou 1');

    //                 this.dataSentimento = value;
    //                 this.colorSentimento = this.setColorSentimento(
    //                   this.dataSentimento
    //                 );
    //                 resolve(true);
    //               },
    //               error: (error) => {
    //                 console.log(' n passou 1');
    //                 reject(true);
    //               },
    //             });
    //         }),
    //         await new Promise((resolve, reject) => {
    //           this.dataAdminService.noticiaPorMidia(request).subscribe({
    //             next: (value) => {
    //               console.log('passou 2');
    //               this.dataMidia = value;
    //               this.colorMidia = this.setColorMidia(this.dataMidia);
    //               resolve(true);
    //             },
    //             error: (error) => {
    //               console.log(' n passou 2');
    //               reject(true);
    //             },
    //           });
    //         }),
    //         new Promise((resolve, reject) => {
    //           this.dataAdminService.noticiaPorVeiculo(request).subscribe({
    //             next: (value) => {
    //               console.log('passou 3');
    //               this.dataVeiculo = value;
    //               console.log('resposta da api', value);

    //               resolve(true);
    //             },
    //             error: (error) => {
    //               console.log('n passou 3');
    //               reject(true);
    //             },
    //           });
    //         }),
    //         new Promise((resolve, reject) => {
    //           this.dataAdminService
    //             .sentimentoPorCategoria(request)
    //             .subscribe({
    //               next: (value) => {
    //                 console.log('passou 4');
    //                 this.dataSentimentoCategoria = value;
    //                 resolve(true);
    //               },
    //               error: (error) => {
    //                 console.log('n passou 4');
    //                 reject(true);
    //               },
    //             });
    //         }),
    //         new Promise((resolve, reject) => {
    //           this.dataAdminService
    //             .listarTabela(
    //               `1?page=1&per_page=${
    //                 this.rowsPerPage
    //               }&${this.criarStringRequest()}`
    //             )
    //             .subscribe({
    //               next: (value) => {
    //                 this.dataTabela = value.records;

    //                 this.length = value._metadata.total_count;
    //                 this.dataSource = new MatTableDataSource(this.dataTabela);
    //                 this.paginaAtual = 1;
    //                 this.ultimaPagina = value._metadata.total_pages;

    //                 resolve(true);
    //               },
    //               error: (error) => {
    //                 reject(true);
    //               },
    //             });
    //         }),
    //       ]);

    //       Swal.close();
    //     } catch (error) {
    //       console.log(error);
    //       Swal.fire({
    //         icon: 'error',
    //         title: 'houve um erro ao carregar os filtros',
    //         text: 'Por favor, tente novamente.',
    //         confirmButtonColor: 'orange',
    //       });
    //     }
    //   },
    // });
  }

  async addFiltroSelect(event: any, nome: keyof filterSelected, id: any) {
    if (event.isUserInput == false) return;

    this.filterSelected[nome] = id;
  }

  addFiltroInput(input: string) {
    if (
      this.filterForm.controls[input as keyof typeof this.filterForm.controls]
        .value == ''
    ) {
      this.filterForm.controls[
        input as keyof typeof this.filterForm.controls
      ].setValue(null);

      if (input == 'dataInicial') {
        this.minDate = <Date>{};
      }
      if (input == 'dataFinal') {
        this.maxDate = new Date();
      }

      this.filterSelected[input.slice(0, -1) as keyof filterSelected] =
        undefined;
    }
  }

  // --------------------------------- evento -----------------------------------------------

  validateWordEventos(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null; // A palavra é válida
      }
      const enteredWord = control.value;

      if (this.eventos.map((evento) => evento.name).includes(enteredWord)) {
        return null; // A palavra é válida
      } else {
        return { invalidWord: true }; // A palavra é inválida
      }
    };
  }

  valueChangesEvento() {
    this.filteredOptionsEventos =
      this.filterForm.controls.eventos.valueChanges.pipe(
        startWith(''),
        map((value) => this.filterEvento(value as string))
      );
  }

  filterEvento(value: string): APIReturns[] {
    if (value == null) value = '';
    const filterValue = value.toLowerCase();
    return this.eventos.filter((option) =>
      option.name.toLowerCase().includes(filterValue)
    );
  }

  async listar_eventos() {
    return new Promise((resolve, reject) => {
      this.eventoService.listarEventosProductor().subscribe({
        next: (value) => {
          value.forEach((element) => {
            this.eventos.push(element);
          });

          this.valueChangesEvento();
          resolve(true);
        },
      });
    });
  }

  // --------------------------------- espaco----------------------------------------------

  validateWordEspacos(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null; // A palavra é válida
      }
      const enteredWord = control.value;

      if (this.espacos.map((espaco) => espaco.name).includes(enteredWord)) {
        return null; // A palavra é válida
      } else {
        return { invalidWord: true }; // A palavra é inválida
      }
    };
  }

  valueChangesEspaco() {
    this.filteredOptionsEspacos =
      this.filterForm.controls.espacos.valueChanges.pipe(
        startWith(''),
        map((value) => this.filterEspaco(value as string))
      );
  }

  filterEspaco(value: string): APIReturns[] {
    if (value == null) value = '';
    const filterValue = value.toLowerCase();
    return this.espacos.filter((option) =>
      option.name.toLowerCase().includes(filterValue)
    );
  }

  async listar_espacos() {
    return new Promise((resolve, reject) => {
      this.espacoService.listarEspacosProductor().subscribe({
        next: (value) => {
          value.forEach((element) => {
            this.espacos.push(element);
          });

          this.valueChangesEspaco();
          resolve(true);
        },
      });
    });
  }

  // --------------------------------- clasEtaria ----------------------------------------------

  validateWordClasEtarias(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null; // A palavra é válida
      }
      const enteredWord = control.value;

      if (
        this.clasesEtarias
          .map((clasEtaria) => clasEtaria.name)
          .includes(enteredWord)
      ) {
        return null; // A palavra é válida
      } else {
        return { invalidWord: true }; // A palavra é inválida
      }
    };
  }

  valueChangesClasEtaria() {
    this.filteredOptionsClasesEtarias =
      this.filterForm.controls.clasEtarias.valueChanges.pipe(
        startWith(''),
        map((value) => this.filterClasEtaria(value as string))
      );
  }

  filterClasEtaria(value: string): APIReturns[] {
    if (value == null) value = '';
    const filterValue = value.toLowerCase();
    return this.clasesEtarias.filter((option) =>
      option.name.toLowerCase().includes(filterValue)
    );
  }

  async listar_clasEtarias() {
    return new Promise((resolve, reject) => {
      this.clasEtariaService.listarClasEtariasProductor().subscribe({
        next: (value) => {
          value.forEach((element) => {
            this.clasesEtarias.push(element);
          });

          this.valueChangesClasEtaria();
          resolve(true);
        },
      });
    });
  }

  // --------------------------------- donoEspaco ----------------------------------------------

  validateWordDonoEspacos(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null; // A palavra é válida
      }
      const enteredWord = control.value;

      if (
        this.donoEspacos
          .map((donoEspaco) => donoEspaco.name)
          .includes(enteredWord)
      ) {
        return null; // A palavra é válida
      } else {
        return { invalidWord: true }; // A palavra é inválida
      }
    };
  }

  valueChangesDonoEspaco() {
    this.filteredOptionsDonoEspacos =
      this.filterForm.controls.donoEspacos.valueChanges.pipe(
        startWith(''),
        map((value) => this.filterDonoEspaco(value as string))
      );
  }

  filterDonoEspaco(value: string): APIReturns[] {
    if (value == null) value = '';
    const filterValue = value.toLowerCase();
    return this.donoEspacos.filter((option) =>
      option.name.toLowerCase().includes(filterValue)
    );
  }

  async listar_donoEspacos() {
    return new Promise((resolve, reject) => {
      this.proprietarioEspacoService.listarProprietarioEspaco().subscribe({
        next: (value) => {
          value.forEach((element) => {
            this.donoEspacos.push(element);
          });

          this.valueChangesDonoEspaco();
          resolve(true);
        },
      });
    });
  }

  // --------------------------------- donoEvento ----------------------------------------------

  validateWordDonoEventos(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null; // A palavra é válida
      }
      const enteredWord = control.value;

      if (
        this.donoEventos
          .map((donoEvento) => donoEvento.name)
          .includes(enteredWord)
      ) {
        return null; // A palavra é válida
      } else {
        return { invalidWord: true }; // A palavra é inválida
      }
    };
  }

  valueChangesDonoEvento() {
    this.filteredOptionsDonoEventos =
      this.filterForm.controls.donoEventos.valueChanges.pipe(
        startWith(''),
        map((value) => this.filterDonoEvento(value as string))
      );
  }

  filterDonoEvento(value: string): APIReturns[] {
    if (value == null) value = '';
    const filterValue = value.toLowerCase();
    return this.donoEventos.filter((option) =>
      option.name.toLowerCase().includes(filterValue)
    );
  }

  async listar_donoEventos() {
    return new Promise((resolve, reject) => {
      this.proprietarioEventoService.listarProprietarioEvento().subscribe({
        next: (value) => {
          value.forEach((element) => {
            this.donoEventos.push(element);
          });

          this.valueChangesDonoEvento();
          resolve(true);
        },
      });
    });
  }

  // --------------------------------- donoProjeto ----------------------------------------------

  validateWordDonoProjetos(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null; // A palavra é válida
      }
      const enteredWord = control.value;

      if (
        this.donoProjetos
          .map((donoProjeto) => donoProjeto.name)
          .includes(enteredWord)
      ) {
        return null; // A palavra é válida
      } else {
        return { invalidWord: true }; // A palavra é inválida
      }
    };
  }

  valueChangesDonoProjeto() {
    this.filteredOptionsDonoProjetos =
      this.filterForm.controls.donoProjetos.valueChanges.pipe(
        startWith(''),
        map((value) => this.filterDonoProjeto(value as string))
      );
  }

  filterDonoProjeto(value: string): APIReturns[] {
    if (value == null) value = '';
    const filterValue = value.toLowerCase();
    return this.donoProjetos.filter((option) =>
      option.name.toLowerCase().includes(filterValue)
    );
  }

  async listar_donoProjetos() {
    return new Promise((resolve, reject) => {
      this.proprietarioProjetoService.listarProprietarioProjeto().subscribe({
        next: (value) => {
          value.forEach((element) => {
            this.donoProjetos.push(element);
          });

          this.valueChangesDonoProjeto();
          resolve(true);
        },
      });
    });
  }

  // --------------------------------- Cores -----------------------------------------------
  setColorSentimento(matriz: any[][]): Color[] {
    const colors: Color[] = [];
    matriz.forEach((element) => {
      if (element[0] === 'POSITIVA') {
        colors.push('#77C4A8');
      }
      if (element[0] === 'NEGATIVA') {
        colors.push('#DD6B7F');
      }
      if (element[0] === 'NEUTRA') {
        colors.push('#F5C869');
      }
      if (element[0] === 'PUBLICIDADE') {
        colors.push('#6E9CD2');
      }
    });
    return colors;
  }

  setColorMidia(matriz: any[][]): Color[] {
    const colors: Color[] = [];
    matriz.forEach((element) => {
      if (element[0] === 'Site') {
        colors.push('#3257A8');
      }
      if (element[0] === 'TV') {
        colors.push('#8B3D88');
      }
      if (element[0] === 'Rádio') {
        colors.push('#37A794');
      }
      if (element[0] === 'Impresso') {
        colors.push('#DD6B7F');
      }
    });
    return colors;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  async handlePageEvent(event: PageEvent) {
    this.dataSource = new MatTableDataSource();

    // if (event.pageSize != this.rowsPerPage) {
    //   Swal.fire({
    //     title: 'Carregando...',

    //     timerProgressBar: true,
    //     showConfirmButton: false,
    //     allowOutsideClick: false,
    //     didOpen: async () => {
    //       Swal.showLoading();
    //       try {
    //         await new Promise((resolve, reject) => {
    //           this.dataAdminService
    //             .listarTabela(
    //               `1?page=${this.paginaAtual}&per_page=${
    //                 event.pageSize
    //               }&${this.criarStringRequest()}`
    //             )
    //             .subscribe({
    //               next: (value) => {
    //                 this.dataTabela = value.records;
    //                 console.log(value);
    //                 this.length = value._metadata.total_count;
    //                 this.dataSource = new MatTableDataSource(this.dataTabela);
    //                 this.rowsPerPage = event.pageSize;
    //                 this.ultimaPagina = value._metadata.total_pages;
    //                 resolve(true);
    //               },
    //               error: (error) => {
    //                 reject(true);
    //               },
    //             });
    //         });
    //         Swal.close();
    //       } catch (error) {
    //         Swal.fire({
    //           icon: 'error',
    //           title: 'houve um erro ao carregar os filtros',
    //           text: 'Por favor, tente novamente.',
    //           confirmButtonColor: 'orange',
    //         });
    //         Swal.close();
    //       }
    //     },
    //   });
    // }

    // if (event.previousPageIndex == event.pageIndex - 1) {
    //   Swal.fire({
    //     title: 'Carregando...',

    //     timerProgressBar: true,
    //     showConfirmButton: false,
    //     allowOutsideClick: false,
    //     didOpen: async () => {
    //       Swal.showLoading();
    //       try {
    //         await new Promise((resolve, reject) => {
    //           this.dataAdminService
    //             .listarTabela(
    //               `1?page=${this.paginaAtual + 1}&per_page=${
    //                 this.rowsPerPage
    //               }&${this.criarStringRequest()}`
    //             )
    //             .subscribe({
    //               next: (value) => {
    //                 this.dataTabela = value.records;
    //                 console.log(value);
    //                 this.length = value._metadata.total_count;
    //                 this.dataSource = new MatTableDataSource(this.dataTabela);
    //                 this.paginaAtual = this.paginaAtual + 1;
    //                 resolve(true);
    //               },
    //               error: (error) => {
    //                 reject(true);
    //               },
    //             });
    //         });
    //         Swal.close();
    //       } catch (error) {
    //         Swal.fire({
    //           icon: 'error',
    //           title: 'houve um erro ao carregar os filtros',
    //           text: 'Por favor, tente novamente.',
    //           confirmButtonColor: 'orange',
    //         });
    //         Swal.close();
    //       }
    //     },
    //   });
    // }
    // else if (event.previousPageIndex == event.pageIndex + 1) {
    //   Swal.fire({
    //     title: 'Carregando...',

    //     timerProgressBar: true,
    //     showConfirmButton: false,
    //     allowOutsideClick: false,
    //     didOpen: async () => {
    //       Swal.showLoading();
    //       try {
    //         await new Promise((resolve, reject) => {
    //           this.dataAdminService
    //             .listarTabela(
    //               `1?page=${this.paginaAtual - 1}&per_page=${
    //                 this.rowsPerPage
    //               }&${this.criarStringRequest()}`
    //             )
    //             .subscribe({
    //               next: (value) => {
    //                 this.dataTabela = value.records;
    //                 console.log(value);
    //                 this.length = value._metadata.total_count;
    //                 this.dataSource = new MatTableDataSource(this.dataTabela);
    //                 this.paginaAtual = this.paginaAtual - 1;

    //                 resolve(true);
    //               },
    //               error: (error) => {
    //                 reject(true);
    //               },
    //             });
    //         });
    //         Swal.close();
    //       } catch (error) {
    //         Swal.fire({
    //           icon: 'error',
    //           title: 'houve um erro ao carregar os filtros',
    //           text: 'Por favor, tente novamente.',
    //           confirmButtonColor: 'orange',
    //         });
    //         Swal.close();
    //       }
    //     },
    //   });
    // }

    // else if (
    //   event.previousPageIndex != undefined &&
    //   event.previousPageIndex > event.pageIndex
    // ) {
    //   Swal.fire({
    //     title: 'Carregando...',

    //     timerProgressBar: true,
    //     showConfirmButton: false,
    //     allowOutsideClick: false,
    //     didOpen: async () => {
    //       Swal.showLoading();
    //       try {
    //         await new Promise((resolve, reject) => {
    //           this.dataAdminService
    //             .listarTabela(
    //               `1?page=1&per_page=${
    //                 this.rowsPerPage
    //               }&${this.criarStringRequest()}`
    //             )
    //             .subscribe({
    //               next: (value) => {
    //                 this.dataTabela = value.records;
    //                 console.log(value);
    //                 this.length = value._metadata.total_count;
    //                 this.dataSource = new MatTableDataSource(this.dataTabela);
    //                 this.paginaAtual = 1;
    //                 resolve(true);
    //               },
    //               error: (error) => {
    //                 reject(true);
    //               },
    //             });
    //         });
    //         Swal.close();
    //       } catch (error) {
    //         Swal.fire({
    //           icon: 'error',
    //           title: 'houve um erro ao carregar os filtros',
    //           text: 'Por favor, tente novamente.',
    //           confirmButtonColor: 'orange',
    //         });
    //         Swal.close();
    //       }
    //     },
    //   });
    // }

    // else if (
    //   event.previousPageIndex != undefined &&
    //   event.previousPageIndex < event.pageIndex
    // ) {
    //   Swal.fire({
    //     background: '#ffffff00',
    //     showConfirmButton: false,
    //     allowOutsideClick: false,
    //     didOpen: async () => {
    //       Swal.showLoading();
    //       try {
    //         await new Promise((resolve, reject) => {
    //           this.dataAdminService
    //             .listarTabela(
    //               `1?page=${this.ultimaPagina}&per_page=${
    //                 this.rowsPerPage
    //               }&${this.criarStringRequest()}`
    //             )
    //             .subscribe({
    //               next: (value) => {
    //                 this.dataTabela = value.records;
    //                 console.log(value);
    //                 this.length = value._metadata.total_count;
    //                 this.dataSource = new MatTableDataSource(this.dataTabela);
    //                 this.paginaAtual = this.ultimaPagina;
    //                 console.log('carregou a ultima pagina');

    //                 resolve(true);
    //               },
    //               error: (error) => {
    //                 reject(true);
    //               },
    //             });
    //         });
    //         Swal.close();
    //       } catch (error) {
    //         Swal.fire({
    //           icon: 'error',
    //           title: 'houve um erro ao carregar os filtros',
    //           text: 'Por favor, tente novamente.',
    //           confirmButtonColor: 'orange',
    //         });
    //         Swal.close();
    //       }
    //     },
    //   });
    // }

    this.pageEvent = event;

    this.pageIndex = event.pageIndex;
  }

  async gerarPDF() {
    let doc: jsPDF;
    console.log('charts', this.charts);

    this.charts.forEach(async (element, index) => {
      element.imageOutput();

      if (index == 0) {
        doc = new jsPDF({
          orientation:
            this.chartData.imgWidth > this.chartData.imgHeight
              ? 'landscape'
              : 'portrait', // Define a orientação com base nas dimensões do gráfico
          unit: 'px', // Unidade de medida para as dimensões
          format: [this.chartData.imgWidth + 10, this.chartData.imgHeight + 40],
        });
      }

      doc.addImage(
        this.chartData.dataURL,
        'PNG',
        10,
        10,
        this.chartData.imgWidth,
        this.chartData.imgHeight
      ); // coordenadas x, y e dimensões da imagem
      doc.addPage();
    });

    if (doc!) doc.save('chart.pdf');
  }

  async gerarDashboard() {
    const pdf = new jsPDF({
      orientation: 'landscape',
    });

    const options = {
      background: 'white',
      scale: 3, // Ajuste conforme necessário para a qualidade da imagem
    };

    // Esperar 1 segundo antes de capturar a div

    try {
      const canvas = await html2canvas(
        this.dashboard.nativeElement as HTMLElement,
        options
      );
      const imgData = canvas.toDataURL('image/png');

      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save('dashboard.pdf'); // Salva o PDF
    } catch (error) {
      console.error('Erro ao gerar o PDF:', error);
    }
  }

  handleChartImage(chartImageObj: {
    dataURL: string;
    imgWidth: number;
    imgHeight: number;
  }): void {
    const { dataURL, imgWidth, imgHeight } = chartImageObj;
    this.chartData.dataURL = dataURL;
    this.chartData.imgWidth = imgWidth;
    this.chartData.imgHeight = imgHeight;

    // Agora você pode usar esses dados como preferir, talvez adicionar a um PDF
  }
}
