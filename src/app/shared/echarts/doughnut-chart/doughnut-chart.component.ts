import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { Color, ECharts, type EChartsOption } from 'echarts';
import * as echarts from 'echarts/core';
import { EChartTheme } from 'src/assets/echarts-theme';
import { jsPDF } from 'jspdf';

@Component({
  selector: 'app-doughnut-chart',
  templateUrl: './doughnut-chart.component.html',
  styleUrls: ['./doughnut-chart.component.scss'],
})
export class DoughnutChartComponent implements OnInit, OnChanges {
  @Input() data: any[][] = [];
  // As cores são passadas como um array de strings
  @Input() color: Color[] = [];

  @Input() title: string = '';

  @Output() chartImage = new EventEmitter<{
    dataURL: string;
    imgWidth: number;
    imgHeight: number;
  }>();

  @ViewChild('chart1', { static: true }) chartElement!: ElementRef;

  options: EChartsOption = {};
  mergeOptions: EChartsOption = {};
  tema: EChartsOption = EChartTheme.theme;

  constructor() {}

  ngOnInit(): void {
    this.options = {
      title: {
        text: this.title,
        left: 'center',
      },
      toolbox: {
        show: true,
        feature: {
          saveAsImage: {
            title: 'Salvar',
            pixelRatio: 4,
          },
        },
      },
      legend: {
        orient: 'horizontal',
        bottom: 'bottom',
        show: this.data.length > 5 ? false : true,
      },
      tooltip: {},
      dataset: {
        source: this.data,
      },
      series: [
        {
          type: 'pie',
          // faz com que o gráfico seja um donut
          radius: ['40%', '70%'],
          label: {
            // mostra a porcentagem referente a cada fatia
            formatter: '{b} {@[1]} ({d}%)',
          },
          top: '10%',
          bottom: '10%',
        },
      ],
    };
  }

  ngOnChanges(): void {
    this.alterarDados();
  }

  alterarDados() {
    this.mergeOptions = {
      legend: {
        orient: 'horizontal',
        bottom: 'bottom',
        show: this.data.length > 5 ? false : true,
      },
      color: this.color,
      dataset: {
        source: this.data,
      },
    };
  }

  async imageOutput() {
    const chart = echarts.init(this.chartElement.nativeElement);
    const imageDataURL = chart.getDataURL({
      type: 'jpeg', // ou 'jpeg', dependendo do formato desejado
      pixelRatio: 2, // opcional
      backgroundColor: '#fff', // cor de fundo opcional
    });

    const imgWidth = chart.getWidth(); // largura da imagem no PDF
    const imgHeight = chart.getHeight(); // altura proporcional

    const chartImageObj = {
      dataURL: imageDataURL,
      imgWidth: imgWidth,
      imgHeight: imgHeight,
    };
    this.chartImage.emit(chartImageObj);
    return;
  }

  loadImage(src: any) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });
  }

  getChartImage(chart: any) {
    return this.loadImage(chart.getDataURL());
  }
}
