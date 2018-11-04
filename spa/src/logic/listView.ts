import * as $ from 'jquery';
import {Company} from '../entities/company';
import {Authenticator} from '../plumbing/authenticator';
import {HttpClient} from '../plumbing/httpClient';

/*
 * Logic related to the list view
 */
export class ListView {

    /*
     * Fields
     */
    private _authenticator: Authenticator;
    private _apiBaseUrl: string;

    /*
     * Class setup
     */
    public constructor(authenticator: Authenticator, apiBaseUrl: string) {
        this._authenticator = authenticator;
        this._apiBaseUrl = apiBaseUrl;
        this._setupCallbacks();
    }

    /*
     * Wait for data then render it
     */
    public async execute(): Promise<void> {

        const data = await
            HttpClient.callApi(`${this._apiBaseUrl}/companies`, 'GET', null, this._authenticator) as Company[];
        this._renderData(data);
    }

    /*
     * Hide UI elements when the view unloads
     */
    public unload(): void {
        $('.listcontainer').addClass('hide');
    }

    /*
     * Render data
     */
    private _renderData(companies: Company[]): void {

        // Show buttons and render
        $('.listcontainer').removeClass('hide');
        $('.panel-group').text('');

        companies.forEach((company: Company) => {

            // Format fields for display
            const formattedTargetUsd = Number(company.targetUsd).toLocaleString();
            const formattedInvestmentUsd = Number(company.investmentUsd).toLocaleString();

            // Render the company details
            const companyDiv = $(`<div class='panel panel-default'>
                                    <div class='panel-body'>
                                      <div class='row'>
                                        <div class='col-xs-1'>
                                            <img src='images/${company.id}.svg' />
                                        </div>
                                        <div class='col-xs-2'>
                                            <br/>
                                            ${company.name}
                                        </div>
                                        <div class='col-xs-3'>
                                            <br/>
                                            <a data-id=${company.id}>View Transactions</a>
                                        </div>
                                        <div class='col-xs-2 amount'>
                                            <br/>
                                            ${formattedTargetUsd}<br/>
                                        </div>
                                        <div class='col-xs-2 amount'>
                                            <br/>
                                            ${formattedInvestmentUsd}<br/>
                                        </div>
                                            <br/>
                                            <div class='col-xs-2'>${company.noInvestors}</div>
                                      </div>
                                    </div>
                                  </div>`);

            // Update the DOM
            $('.panel-group').append(companyDiv);
        });

        // A click handler will change the view to look at transaction details
        $('a').on('click', this._selectCompanyTransactions);
    }

    /*
     * When a thumbnail is clicked we will request transactions data and then update the view
     */
    private _selectCompanyTransactions(e: any): void {

        const id = $(e.target).attr('data-id');
        location.hash = `#company=${id}`;
        e.preventDefault();
    }

    /*
     * Plumbing to ensure that the this parameter is available in async callbacks
     */
    private _setupCallbacks(): void {
        this._renderData = this._renderData.bind(this);
        this._selectCompanyTransactions = this._selectCompanyTransactions.bind(this);
   }
}
