import { Component, Input, OnInit } from '@angular/core';

import { Project } from '../../../project';
import { HelmChartService } from '../helm-chart.service';
import { HelmChartDetail } from '../helm-chart.interface.service';
import { finalize } from 'rxjs/operators';
import { SystemInfo, SystemInfoService } from '../../../../../shared/services';
import { ErrorHandler } from '../../../../../shared/units/error-handler';
import { downloadFile } from '../../../../../shared/units/utils';

@Component({
    selector: 'hbr-chart-detail',
    templateUrl: './chart-detail.component.html',
    styleUrls: ['./chart-detail.component.scss'],
})
export class ChartDetailComponent implements OnInit {
    @Input() projectId: number;
    @Input() project: Project;
    @Input() chartName: string;
    @Input() chartVersion: string;
    @Input() roleName: string;
    @Input() hasSignedIn: boolean;
    @Input() hasProjectAdminRole: boolean;

    loading = true;
    isMember = false;
    chartDetail: HelmChartDetail;
    systemInfo: SystemInfo;

    repoURL = '';

    constructor(
        private errorHandler: ErrorHandler,
        private systemInfoService: SystemInfoService,
        private helmChartService: HelmChartService
    ) {}

    ngOnInit(): void {
        this.systemInfoService.getSystemInfo().subscribe(
            systemInfo => {
                this.systemInfo = systemInfo;
                if (this.systemInfo.external_url) {
                    this.repoURL = `${this.systemInfo.external_url}`;
                } else {
                    let scheme = 'http://';
                    if (this.systemInfo.has_ca_root) {
                        scheme = 'https://';
                    }
                    this.repoURL = `${scheme}${this.systemInfo.registry_url}`;
                }
            },
            error => this.errorHandler.error(error)
        );
        this.refresh();
    }
    public get chartNameWithVersion() {
        return `${this.chartName}:${this.chartVersion}`;
    }

    public get isChartExist() {
        return !!this.chartDetail;
    }

    refresh() {
        this.loading = true;
        this.helmChartService
            .getChartDetail(
                this.project.name,
                this.chartName,
                this.chartVersion
            )
            .pipe(
                finalize(() => {
                    this.loading = false;
                })
            )
            .subscribe(
                chartDetail => {
                    this.chartDetail = chartDetail;
                },
                err => {
                    this.errorHandler.error(err);
                }
            );
    }

    downloadChart() {
        if (
            !this.chartDetail ||
            !this.chartDetail.metadata ||
            !this.chartDetail.metadata.urls ||
            this.chartDetail.metadata.urls.length < 1
        ) {
            return;
        }
        let filename = this.chartDetail.metadata.urls[0];

        this.helmChartService
            .downloadChart(this.project.name, filename)
            .subscribe(
                res => {
                    downloadFile(res);
                },
                error => {
                    this.errorHandler.error(error);
                }
            );
    }
}
