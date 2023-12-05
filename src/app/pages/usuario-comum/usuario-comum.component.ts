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
import { RequestsService } from 'src/app/core/services/requests-data.service';

interface filterSelected {
  evento: string;
  espaco: string;
  clasEtaria: string;
  dataInicial: any;
  dataFinal: any;
}

interface chartData {
  dataURL: string;
  imgWidth: number;
  imgHeight: number;
}

@Component({
  selector: 'app-usuario-comum',
  templateUrl: './usuario-comum.component.html',
  styleUrls: ['./usuario-comum.component.scss'],
})
export class UsuarioComumComponent implements OnInit, AfterViewInit {
  length = 0;
  pageIndex = 1;
  pageEvent: PageEvent = <any>{};

  // data dos gráficos
  dataEvento = [];
  dataEspaco = [];
  dataClasEtaria = [];

  dataSentimento = [];
  dataMidia = [];
  dataVeiculo = [];
  dataSentimentoCategoria = [];

  dataTabela = <any>[];
  paginaAtual = 1;
  rowsPerPage = 10;
  ultimaPagina = 1;

  filterSelected: filterSelected = {} as filterSelected;
  isTelaMenorQue500px: number = 5;
  nubergraphs: number = 2;
  chipShow = <any>[];
  minDate = <Date>{};
  maxDate = new Date();
  todayDate = new Date();
  ninetyDaysAgo = new Date(new Date().setDate(this.todayDate.getDate() - 90));

  filterForm = new FormGroup({
    eventos: new FormControl(''),
    espacos: new FormControl(''),
    clasEtarias: new FormControl(''),

    dataInicial: new FormControl<Date | null>(this.ninetyDaysAgo),
    dataFinal: new FormControl<Date | null>(this.todayDate),
  });

  // arrays de opçoes para os filtros ---------------------

  eventos: Array<APIReturns> = [];
  espacos: Array<APIReturns> = [];
  clasesEtarias: Array<APIReturns> = [];

  // variaveis para filtragem de filtros para os filtros ---------------------

  @ViewChild('completeEvento') completeEvento: MatAutocomplete = <any>{};
  @ViewChild('completeEspaco') completeEspaco: MatAutocomplete = <any>{};
  @ViewChild('completeClasEtaria') completeClasEtaria: MatAutocomplete = <
    any
  >{};

  @ViewChild(MatPaginator) paginator: MatPaginator = <any>{};
  @ViewChild(MatSort) sort: MatSort = <any>{};

  @ViewChildren('qualquer') charts: QueryList<any> = <any>[];
  @ViewChild('dashboard') dashboard!: ElementRef;

  displayedColumns: string[] = [
    'AgentsId',
    'AgentsName',
    'AgentsDescription',
    'AgentsCreateTSP',
    'AgentsUpdateTSP',
    'AgentsParent',
    'AgentsTerms',
    'AgentsChildren',
    'AgentsSpaces',
    'AgentsEvents',
    'AgentsProjects',
    'EventsId',
    'EventsName',
    'EventsDescription',
    'EventsCreateTSP',
    'EventsUpdateTSP',
    'EventsClasEtaria',
    'EventsOwner',
    'EventsProject',
    'SpacesId',
    'SpacesLocation',
    'SpacesName',
    'SpacesDescription',
    'SpacesCreateTSP',
    'SpacesUpdateTSP',
    'SpacesEventOcur',
    'SpacesHorarios',
    'SpacesTelefone',
    'SpacesEmail',
    'SpacesChildren',
    'SpacesTerms',
    'SpacesParent',
    'SpacesOwner',
    'EventOcurId',
    'EventOcurStartsOn',
    'EventOcurStartsAt',
    'EventOcurEndsAt',
    'EventOcurFrequency',
    'EventOcurSeparation',
    'EventOcurEvent',
    'EventOcurSpace',
    'ProjectId',
    'ProjectName',
    'ProjectDescription',
    'ProjectCreateTSP',
    'ProjectUpdateTSP',
    'ProjectRegistrationFrom',
    'ProjectRegistrationTo',
    'ProjectParent',
    'ProjectChildren',
    'ProjectOwner',
    'ProjectEvents',
  ];

  columnsToDisplay: string[] = [];

  dataSource: MatTableDataSource<any>;

  chartData: chartData = <any>{};

  TabelaEvents: boolean = false;
  EventsId: boolean = false;
  EventsName: boolean = false;
  EventsDescription: boolean = false;
  EventsCreateTSP: boolean = false;
  EventsUpdateTSP: boolean = false;
  EventsClasEtaria: boolean = false;
  EventsOwner: boolean = false;
  EventsProject: boolean = false;

  TabelaAgents: boolean = false;
  AgentsId: boolean = false;
  AgentsName: boolean = false;
  AgentsDescription: boolean = false;
  AgentsCreateTSP: boolean = false;
  AgentsUpdateTSP: boolean = false;
  AgentsParent: boolean = false;
  AgentsTerms: boolean = false;
  AgentsChildren: boolean = false;
  AgentsSpaces: boolean = false;
  AgentsEvents: boolean = false;
  AgentsProjects: boolean = false;

  TabelaSpaces: boolean = false;
  SpacesId: boolean = false;
  SpacesLocation: boolean = false;
  SpacesName: boolean = false;
  SpacesDescription: boolean = false;
  SpacesCreateTSP: boolean = false;
  SpacesUpdateTSP: boolean = false;
  SpacesEventOcur: boolean = false;
  SpacesHorarios: boolean = false;
  SpacesTelefone: boolean = false;
  SpacesEmail: boolean = false;
  SpacesChildren: boolean = false;
  SpacesTerms: boolean = false;
  SpacesParent: boolean = false;
  SpacesOwner: boolean = false;

  TabelaEventOcur: boolean = false;
  EventOcurId: boolean = false;
  EventOcurStartsOn: boolean = false;
  EventOcurStartsAt: boolean = false;
  EventOcurEndsAt: boolean = false;
  EventOcurFrequency: boolean = false;
  EventOcurSeparation: boolean = false;
  EventOcurEvent: boolean = false;
  EventOcurSpace: boolean = false;

  TabelaProject: boolean = false;
  ProjectId: boolean = false;
  ProjectName: boolean = false;
  ProjectDescription: boolean = false;
  ProjectCreateTSP: boolean = false;
  ProjectUpdateTSP: boolean = false;
  ProjectRegistrationFrom: boolean = false;
  ProjectRegistrationTo: boolean = false;
  ProjectParent: boolean = false;
  ProjectChildren: boolean = false;
  ProjectOwner: boolean = false;
  ProjectEvents: boolean = false;

  constructor(
    private eventoService: EventoService,
    private espacoService: EspacoService,
    private clasEtariaService: ClasEtariaService,
    private requestsService: RequestsService
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

            new Promise((resolve, reject) => {
              this.requestsService
                .listarTabelaCommon(
                  `?page=1&per_page=${
                    this.rowsPerPage
                  }&${this.criarStringRequest()}`
                )
                .subscribe({
                  next: (value) => {
                    this.dataTabela = value.records;
                    this.length = value._metadata.total_count;
                    this.dataSource = new MatTableDataSource(this.dataTabela);
                    this.ultimaPagina = value._metadata.total_pages;
                    console.log(this.dataTabela);
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
      !this.filterForm.get('clasEtarias')?.errors?.['invalidWord']
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

    this.filtrar();
  }

  criarStringRequest() {
    var request: string = '';

    request = this.criarSringRequestSelects();

    if (this.filterSelected.evento != undefined)
      request = request.concat(`id_evento=${this.filterSelected.evento}&`);

    if (this.filterSelected.espaco != undefined)
      request = request.concat(`id_espaco=${this.filterSelected.espaco}&`);

    if (this.filterSelected.clasEtaria != undefined)
      request = request.concat(
        `id_clas_etaria=${this.filterSelected.clasEtaria}&`
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

  criarSringRequestSelects() {
    var request = '';

    if (this.TabelaAgents) {
      if (this.AgentsId) {
        request = request.concat(`AgentsId=True&`);
        this.columnsToDisplay.push('AgentsId');
      }
      if (this.AgentsName) {
        request = request.concat(`AgentsName=True&`);
        this.columnsToDisplay.push('AgentsName');
      }
      if (this.AgentsDescription) {
        request = request.concat(`AgentsDescription=True&`);
        this.columnsToDisplay.push('AgentsDescription');
      }
      if (this.AgentsCreateTSP) {
        request = request.concat(`AgentsCreateTSP=True&`);
        this.columnsToDisplay.push('AgentsCreateTSP');
      }
      if (this.AgentsUpdateTSP) {
        request = request.concat(`AgentsUpdateTSP=True&`);
        this.columnsToDisplay.push('AgentsUpdateTSP');
      }
      if (this.AgentsParent) {
        request = request.concat(`AgentsParent=True&`);
        this.columnsToDisplay.push('AgentsParent');
      }
      if (this.AgentsTerms) {
        request = request.concat(`AgentsTerms=True&`);
        this.columnsToDisplay.push('AgentsTerms');
      }
      if (this.AgentsChildren) {
        request = request.concat(`AgentsChildren=True&`);
        this.columnsToDisplay.push('AgentsChildren');
      }
      if (this.AgentsSpaces) {
        request = request.concat(`AgentsSpaces=True&`);
        this.columnsToDisplay.push('AgentsSpaces');
      }
      if (this.AgentsEvents) {
        request = request.concat(`AgentsEvents=True&`);
        this.columnsToDisplay.push('AgentsEvents');
      }
      if (this.AgentsProjects) {
        request = request.concat(`AgentsProjects=True&`);
        this.columnsToDisplay.push('AgentsProjects');
      }
    }
    if (this.TabelaEvents) {
      if (this.EventsId) {
        request = request.concat(`EventsId=True&`);
        this.columnsToDisplay.push('EventsId');
      }
      if (this.EventsName) {
        request = request.concat(`EventsName=True&`);
        this.columnsToDisplay.push('EventsName');
      }
      if (this.EventsDescription) {
        request = request.concat(`EventsDescription=True&`);
        this.columnsToDisplay.push('EventsDescription');
      }
      if (this.EventsCreateTSP) {
        request = request.concat(`EventsCreateTSP=True&`);
        this.columnsToDisplay.push('EventsCreateTSP');
      }
      if (this.EventsUpdateTSP) {
        request = request.concat(`EventsUpdateTSP=True&`);
        this.columnsToDisplay.push('EventsUpdateTSP');
      }
      if (this.EventsClasEtaria) {
        request = request.concat(`EventsClasEtaria=True&`);
        this.columnsToDisplay.push('EventsClasEtaria');
      }
      if (this.EventsOwner) {
        request = request.concat(`EventsOwner=True&`);
        this.columnsToDisplay.push('EventsOwner');
      }
      if (this.EventsProject) {
        request = request.concat(`EventsProject=True&`);
        this.columnsToDisplay.push('EventsProject');
      }
    }

    if (this.TabelaSpaces) {
      if (this.SpacesId) {
        request = request.concat(`SpacesId=True&`);
        this.columnsToDisplay.push('SpacesId');
      }
      if (this.SpacesLocation) {
        request = request.concat(`SpacesLocation=True&`);
        this.columnsToDisplay.push('SpacesLocation');
      }
      if (this.SpacesName) {
        request = request.concat(`SpacesName=True&`);
        this.columnsToDisplay.push('SpacesName');
      }
      if (this.SpacesDescription) {
        request = request.concat(`SpacesDescription=True&`);
        this.columnsToDisplay.push('SpacesDescription');
      }
      if (this.SpacesCreateTSP) {
        request = request.concat(`SpacesCreateTSP=True&`);
        this.columnsToDisplay.push('SpacesCreateTSP');
      }
      if (this.SpacesUpdateTSP) {
        request = request.concat(`SpacesUpdateTSP=True&`);
        this.columnsToDisplay.push('SpacesUpdateTSP');
      }
      if (this.SpacesEventOcur) {
        request = request.concat(`SpacesEventOcur=True&`);
        this.columnsToDisplay.push('SpacesEventOcur');
      }
      if (this.SpacesHorarios) {
        request = request.concat(`SpacesHorarios=True&`);
        this.columnsToDisplay.push('SpacesHorarios');
      }
      if (this.SpacesTelefone) {
        request = request.concat(`SpacesTelefone=True&`);
        this.columnsToDisplay.push('SpacesTelefone');
      }
      if (this.SpacesEmail) {
        request = request.concat(`SpacesEmail=True&`);
        this.columnsToDisplay.push('SpacesEmail');
      }
      if (this.SpacesChildren) {
        request = request.concat(`SpacesChildren=True&`);
        this.columnsToDisplay.push('SpacesChildren');
      }
      if (this.SpacesTerms) {
        request = request.concat(`SpacesTerms=True&`);
        this.columnsToDisplay.push('SpacesTerms');
      }
      if (this.SpacesParent) {
        request = request.concat(`SpacesParent=True&`);
        this.columnsToDisplay.push('SpacesParent');
      }
      if (this.SpacesOwner) {
        request = request.concat(`SpacesOwner=True&`);
        this.columnsToDisplay.push('SpacesOwner');
      }
    }

    if (this.TabelaEventOcur) {
      if (this.EventOcurId) {
        request = request.concat(`EventOcurId=True&`);
        this.columnsToDisplay.push('EventOcurId');
      }
      if (this.EventOcurStartsOn) {
        request = request.concat(`EventOcurStartsOn=True&`);
        this.columnsToDisplay.push('EventOcurStartsOn');
      }
      if (this.EventOcurStartsAt) {
        request = request.concat(`EventOcurStartsAt=True&`);
        this.columnsToDisplay.push('EventOcurStartsAt');
      }
      if (this.EventOcurEndsAt) {
        request = request.concat(`EventOcurEndsAt=True&`);
        this.columnsToDisplay.push('EventOcurEndsAt');
      }
      if (this.EventOcurFrequency) {
        request = request.concat(`EventOcurFrequency=True&`);
        this.columnsToDisplay.push('EventOcurFrequency');
      }
      if (this.EventOcurSeparation) {
        request = request.concat(`EventOcurSeparation=True&`);
        this.columnsToDisplay.push('EventOcurSeparation');
      }
      if (this.EventOcurEvent) {
        request = request.concat(`EventOcurEvent=True&`);
        this.columnsToDisplay.push('EventOcurEvent');
      }
      if (this.EventOcurSpace) {
        request = request.concat(`EventOcurSpace=True&`);
        this.columnsToDisplay.push('EventOcurSpace');
      }
    }

    if (this.TabelaProject) {
      if (this.ProjectId) {
        request = request.concat(`ProjectId=True&`);
        this.columnsToDisplay.push('ProjectId');
      }
      if (this.ProjectName) {
        request = request.concat(`ProjectName=True&`);
        this.columnsToDisplay.push('ProjectName');
      }
      if (this.ProjectDescription) {
        request = request.concat(`ProjectDescription=True&`);
        this.columnsToDisplay.push('ProjectDescription');
      }
      if (this.ProjectCreateTSP) {
        request = request.concat(`ProjectCreateTSP=True&`);
        this.columnsToDisplay.push('ProjectCreateTSP');
      }
      if (this.ProjectUpdateTSP) {
        request = request.concat(`ProjectUpdateTSP=True&`);
        this.columnsToDisplay.push('ProjectUpdateTSP');
      }
      if (this.ProjectRegistrationFrom) {
        request = request.concat(`ProjectRegistrationFrom=True&`);
        this.columnsToDisplay.push('ProjectRegistrationFrom');
      }
      if (this.ProjectRegistrationTo) {
        request = request.concat(`ProjectRegistrationTo=True&`);
        this.columnsToDisplay.push('ProjectRegistrationTo');
      }
      if (this.ProjectParent) {
        request = request.concat(`ProjectParent=True&`);
        this.columnsToDisplay.push('ProjectParent');
      }
      if (this.ProjectChildren) {
        request = request.concat(`ProjectChildren=True&`);
        this.columnsToDisplay.push('ProjectChildren');
      }
      if (this.ProjectOwner) {
        request = request.concat(`ProjectOwner=True&`);
        this.columnsToDisplay.push('ProjectOwner');
      }
      if (this.ProjectEvents) {
        request = request.concat(`ProjectEvents=True&`);
        this.columnsToDisplay.push('ProjectEvents');
      }
    }

    return request;
  }

  filtrar() {
    this.showchips();
    this.columnsToDisplay = [];
    var request = this.criarStringRequest();
    console.log(this.columnsToDisplay);

    Swal.fire({
      background: '#ffffff00',
      showConfirmButton: false,
      didOpen: async () => {
        Swal.showLoading();
        try {
          await Promise.all([
            new Promise((resolve, reject) => {
              this.requestsService
                .listarTabelaCommon(
                  `?page=1&per_page=${
                    this.rowsPerPage
                  }&${this.criarStringRequest()}`
                )
                .subscribe({
                  next: (value) => {
                    this.dataTabela = value.records;

                    this.length = value._metadata.total_count;
                    this.dataSource = new MatTableDataSource(this.dataTabela);
                    this.paginaAtual = 1;
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
          console.log(error);
          Swal.fire({
            icon: 'error',
            title: 'houve um erro ao carregar os filtros',
            text: 'Por favor, tente novamente.',
            confirmButtonColor: 'orange',
          });
        }
      },
    });
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

  async listar_eventos() {
    return new Promise((resolve, reject) => {
      this.eventoService.listarEventosCommon().subscribe({
        next: (value) => {
          value.forEach((element) => {
            this.eventos.push(element);
          });
          resolve(true);
        },
      });
    });
  }

  // --------------------------------- espaco----------------------------------------------

  async listar_espacos() {
    return new Promise((resolve, reject) => {
      this.espacoService.listarEspacosCommon().subscribe({
        next: (value) => {
          value.forEach((element) => {
            this.espacos.push(element);
          });
          console.log(this.espacos);
          resolve(true);
        },
      });
    });
  }

  // --------------------------------- clasEtaria ----------------------------------------------

  async listar_clasEtarias() {
    return new Promise((resolve, reject) => {
      this.clasEtariaService.listarClasEtariasCommon().subscribe({
        next: (value) => {
          value.forEach((element) => {
            this.clasesEtarias.push(element);
          });
          console.log(this.clasesEtarias);
          resolve(true);
        },
      });
    });
  }

  // --------------------------------- outros -----------------------------------------------

  async handlePageEvent(event: PageEvent) {
    this.dataSource = new MatTableDataSource();

    if (event.pageSize != this.rowsPerPage) {
      Swal.fire({
        title: 'Carregando...',

        timerProgressBar: true,
        showConfirmButton: false,
        allowOutsideClick: false,
        didOpen: async () => {
          Swal.showLoading();
          try {
            await new Promise((resolve, reject) => {
              this.requestsService
                .listarTabelaCommon(
                  `?page=${this.paginaAtual}&per_page=${
                    event.pageSize
                  }&${this.criarStringRequest()}`
                )
                .subscribe({
                  next: (value) => {
                    this.dataTabela = value.records;
                    console.log(value);
                    this.length = value._metadata.total_count;
                    this.dataSource = new MatTableDataSource(this.dataTabela);
                    this.rowsPerPage = event.pageSize;
                    this.ultimaPagina = value._metadata.total_pages;
                    resolve(true);
                  },
                  error: (error) => {
                    reject(true);
                  },
                });
            });
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

    if (event.previousPageIndex == event.pageIndex - 1) {
      Swal.fire({
        title: 'Carregando...',

        timerProgressBar: true,
        showConfirmButton: false,
        allowOutsideClick: false,
        didOpen: async () => {
          Swal.showLoading();
          try {
            await new Promise((resolve, reject) => {
              this.requestsService
                .listarTabelaCommon(
                  `?page=${this.paginaAtual + 1}&per_page=${
                    this.rowsPerPage
                  }&${this.criarStringRequest()}`
                )
                .subscribe({
                  next: (value) => {
                    this.dataTabela = value.records;
                    console.log(value);
                    this.length = value._metadata.total_count;
                    this.dataSource = new MatTableDataSource(this.dataTabela);
                    this.paginaAtual = this.paginaAtual + 1;
                    resolve(true);
                  },
                  error: (error) => {
                    reject(true);
                  },
                });
            });
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
    } else if (event.previousPageIndex == event.pageIndex + 1) {
      Swal.fire({
        title: 'Carregando...',

        timerProgressBar: true,
        showConfirmButton: false,
        allowOutsideClick: false,
        didOpen: async () => {
          Swal.showLoading();
          try {
            await new Promise((resolve, reject) => {
              this.requestsService
                .listarTabelaCommon(
                  `?page=${this.paginaAtual - 1}&per_page=${
                    this.rowsPerPage
                  }&${this.criarStringRequest()}`
                )
                .subscribe({
                  next: (value) => {
                    this.dataTabela = value.records;
                    console.log(value);
                    this.length = value._metadata.total_count;
                    this.dataSource = new MatTableDataSource(this.dataTabela);
                    this.paginaAtual = this.paginaAtual - 1;

                    resolve(true);
                  },
                  error: (error) => {
                    reject(true);
                  },
                });
            });
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
    } else if (
      event.previousPageIndex != undefined &&
      event.previousPageIndex > event.pageIndex
    ) {
      Swal.fire({
        title: 'Carregando...',

        timerProgressBar: true,
        showConfirmButton: false,
        allowOutsideClick: false,
        didOpen: async () => {
          Swal.showLoading();
          try {
            await new Promise((resolve, reject) => {
              this.requestsService
                .listarTabelaCommon(
                  `?page=1&per_page=${
                    this.rowsPerPage
                  }&${this.criarStringRequest()}`
                )
                .subscribe({
                  next: (value) => {
                    this.dataTabela = value.records;
                    console.log(value);
                    this.length = value._metadata.total_count;
                    this.dataSource = new MatTableDataSource(this.dataTabela);
                    this.paginaAtual = 1;
                    resolve(true);
                  },
                  error: (error) => {
                    reject(true);
                  },
                });
            });
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
    } else if (
      event.previousPageIndex != undefined &&
      event.previousPageIndex < event.pageIndex
    ) {
      Swal.fire({
        background: '#ffffff00',
        showConfirmButton: false,
        allowOutsideClick: false,
        didOpen: async () => {
          Swal.showLoading();
          try {
            await new Promise((resolve, reject) => {
              this.requestsService
                .listarTabelaCommon(
                  `?page=${this.ultimaPagina}&per_page=${
                    this.rowsPerPage
                  }&${this.criarStringRequest()}`
                )
                .subscribe({
                  next: (value) => {
                    this.dataTabela = value.records;
                    console.log(value);
                    this.length = value._metadata.total_count;
                    this.dataSource = new MatTableDataSource(this.dataTabela);
                    this.paginaAtual = this.ultimaPagina;
                    console.log('carregou a ultima pagina');

                    resolve(true);
                  },
                  error: (error) => {
                    reject(true);
                  },
                });
            });
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

    this.pageEvent = event;

    this.pageIndex = event.pageIndex;
  }

  SelectEvents(event: any) {
    this.TabelaEvents = !this.TabelaEvents;
  }

  SelectSpaces(event: any) {
    this.TabelaSpaces = !this.TabelaSpaces;
  }

  SelectEventOcur(event: any) {
    this.TabelaEventOcur = !this.TabelaEventOcur;
  }

  SelectProject(event: any) {
    this.TabelaProject = !this.TabelaProject;
  }

  SelectAgents(event: any) {
    this.TabelaAgents = !this.TabelaAgents;
  }
}
