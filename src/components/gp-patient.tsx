import { State, Component, Prop } from '@stencil/core';


@Component({
  tag: 'gp-patient',
  styleUrl: 'gp-patient.css',
  shadow: true
})
export class GpPatient {

  @Prop() nhsnumber: string;
  @Prop() odscode: string;
  @Prop() token_type: string;
  @Prop() access_token: string;

  @State() response: string;
  
  callApi = async () => {
    const response = await fetch('https://smart-resource-server.azurewebsites.net/patient?nhsnumber='+this.nhsnumber+'&odscode='+this.odscode, 
                                {headers: {authorization: this.token_type + " " + this.access_token}, mode: 'cors'});
    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);
    return body;
  };

  componentWillLoad() {
    this.callApi()
      .then(res => this.response=res.carerecord)
      .catch(err => console.log(err));
  }


  componentWillUpdate() {
    this.callApi()
      .then(res => this.response=res.carerecord)
      .catch(err => console.log(err));
  }


  render() {
    if (this.response==undefined) return(<p>Loading...</p>);
    let res = JSON.parse(this.response);
    let patient = res.entry[0].resource;
    return (
        <div>
          <div class="panel">
            <div class="panel-heading">
              <div class="columns">
                <div class="column">{ patient.name[0].prefix[0] } { patient.name[0].given[0] } { patient.name[0].family[0] }</div>
                <div class="column is-one-third">
                  <ul>
                    <li><label>Gender:</label> <strong>{ patient.gender }</strong></li>
                    <li><label>DOB:</label>  <strong>{ patient.birthDate}</strong></li>
                    <li><label>NHS No.:</label> <strong>{ patient.identifier.value }</strong></li>
                  </ul>
                </div>
              </div>
            </div>
              <table class="table is-fullwidth">
                <tbody>
                  <tr>
                    <td><label>Address:</label>  <strong>{ patient.address[0].text }</strong></td>
                    <td><label>Phone:</label> <strong>{ patient.telecom[0].value }</strong></td>
                    <td><label>GP Details:</label> <strong>TODO</strong></td>
                  </tr>
                </tbody>
              </table>
          </div>
      </div>
    );
  }
}


