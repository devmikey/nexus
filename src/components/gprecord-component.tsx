import { State, Component, Prop } from '@stencil/core';


@Component({
  tag: 'gprecord-component',
  styleUrl: 'gprecord-component.css',
  shadow: true
})
export class GpRecordComponent {

  @Prop({mutable: true, reflectToAttr: true}) recordtype: string;
  @Prop({reflectToAttr: true}) nhsnumber: string;
  @Prop({reflectToAttr: true}) odscode: string;
  @Prop({reflectToAttr: true}) token_type: string;
  @Prop({reflectToAttr: true}) access_token: string;

  @State() response: string;
  
  callApi = async () => {
    const response = await fetch('https://smart-resource-server.azurewebsites.net/carerecord?recordtype='
                                  +this.recordtype+'&nhsnumber='
                                  +this.nhsnumber
                                  +'&odscode='+this.odscode, 
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

  handleClick(recordtype) {
       this.recordtype = recordtype;
  }


  render() {
    if (this.response==undefined) return(<p>Loading...</p>);
    let res = JSON.parse(this.response);
    return (
      <div class="columns is-gapless">
        <div class="column is-one-fifth">
          <nav class="panel">
            <p class="panel-heading">Sections</p>
            <a onClick={this.handleClick.bind(this, 'SUM')} class="panel-block {this.recordtype == 'SUM' ? 'is-active' : ''}">Summary</a>
            <a onClick={this.handleClick.bind(this, 'ENC')} class="panel-block {this.recordtype == 'ENC' ? 'is-active' : ''}">Encounters</a>
            <a onClick={this.handleClick.bind(this, 'CLI')} class="panel-block {this.recordtype == 'CLI' ? 'is-active' : ''}">Clinical Items</a>
            <a onClick={this.handleClick.bind(this, 'ADM')} class="panel-block {this.recordtype == 'ADM' ? 'is-active' : ''}">Administrative</a>
            <a onClick={this.handleClick.bind(this, 'REF')} class="panel-block {this.recordtype == 'REF' ? 'is-active' : ''}">Referrals</a>
            <a onClick={this.handleClick.bind(this, 'IMM')} class="panel-block {this.recordtype == 'IMM' ? 'is-active' : ''}">Immunisations</a>
            <a onClick={this.handleClick.bind(this, 'PRB')} class="panel-block {this.recordtype == 'PRB' ? 'is-active' : ''}">Problems</a>
            <a onClick={this.handleClick.bind(this, 'MED')} class="panel-block {this.recordtype == 'MED' ? 'is-active' : ''}">Medications</a>
            <a onClick={this.handleClick.bind(this, 'OBS')} class="panel-block {this.recordtype == 'OBS' ? 'is-active' : ''}">Observations</a>
            <a onClick={this.handleClick.bind(this, 'INV')} class="panel-block {this.recordtype == 'INV' ? 'is-active' : ''}">Investigations</a>
            <a onClick={this.handleClick.bind(this, 'ALL')} class="panel-block {this.recordtype == 'ALL' ? 'is-active' : ''}">Allergies</a>
            <a onClick={this.handleClick.bind(this, 'PAT')} class="panel-block {this.recordtype == 'PAT' ? 'is-active' : ''}">Demographics</a>
          </nav>
        </div>
        <div class="column">
          <gprecord-panel section={res.entry[0].resource.section[0].text.div}></gprecord-panel>
        </div>
      </div>
    );
  }
}