import { State, Component, Prop } from '@stencil/core';


@Component({
  tag: 'gprecord-component',
  styleUrl: 'gprecord-component.css',
  shadow: true
})
export class GpRecordComponent {

  @Prop({mutable: true, reflectToAttr: true}) recordtype: string = 'SUM';
  @Prop({reflectToAttr: true}) nhsnumber: string;
  @Prop({reflectToAttr: true}) odscode: string;
  @Prop({reflectToAttr: true}) token_type: string;
  @Prop({reflectToAttr: true}) access_token: string;
  @State() response: string;

  @State() toggle: boolean = false;

  recordCache = {}

  callApi = async () => {
    if (this.recordCache[this.recordtype]==undefined) {
      const response = await fetch('https://smart-resource-server.azurewebsites.net/carerecord?recordtype='
                                    +this.recordtype+'&nhsnumber='
                                    +this.nhsnumber
                                    +'&odscode='+this.odscode, 
                                  {headers: {authorization: this.token_type + " " + this.access_token}, mode: 'cors'});
      const body = await response.json();
      this.recordCache[this.recordtype] = body;
      if (response.status !== 200) throw Error(body.message);
    }
    return this.recordCache[this.recordtype];
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

  openMenu(){
    this.toggle = !this.toggle;
  }

  render() {
    if (this.response==undefined) return(<p>Loading...</p>);
    let res = JSON.parse(this.response);
    return (
      <div>
          <a onClick={this.openMenu.bind(this)} role="button" class="navbar-burger" data-target="navMenu" aria-label="menu" aria-expanded="false">
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
          </a>
          <div class={this.toggle ? 'navbar-menu is-active' : 'navbar-menu'} id="navMenu">      
            <a onClick={this.handleClick.bind(this, 'SUM')} class={this.recordtype == 'SUM' ? 'panel-block is-active' : 'panel-block'}>Summary</a>
            <a onClick={this.handleClick.bind(this, 'ENC')} class={this.recordtype == 'ENC' ? 'panel-block is-active' : 'panel-block'}>Encounters</a>
            <a onClick={this.handleClick.bind(this, 'CLI')} class={this.recordtype == 'CLI' ? 'panel-block is-active' : 'panel-block'}>Clinical</a>
            <a onClick={this.handleClick.bind(this, 'ADM')} class={this.recordtype == 'ADM' ? 'panel-block is-active' : 'panel-block'}>Administrative</a>
            <a onClick={this.handleClick.bind(this, 'REF')} class={this.recordtype == 'REF' ? 'panel-block is-active' : 'panel-block'}>Referrals</a>
            <a onClick={this.handleClick.bind(this, 'IMM')} class={this.recordtype == 'IMM' ? 'panel-block is-active' : 'panel-block'}>Immunisations</a>
            <a onClick={this.handleClick.bind(this, 'PRB')} class={this.recordtype == 'PRB' ? 'panel-block is-active' : 'panel-block'}>Problems</a>
            <a onClick={this.handleClick.bind(this, 'MED')} class={this.recordtype == 'MED' ? 'panel-block is-active' : 'panel-block'}>Medications</a>
            <a onClick={this.handleClick.bind(this, 'OBS')} class={this.recordtype == 'OBS' ? 'panel-block is-active' : 'panel-block'}>Observations</a>
            <a onClick={this.handleClick.bind(this, 'INV')} class={this.recordtype == 'INV' ? 'panel-block is-active' : 'panel-block'}>Investigations</a>
            <a onClick={this.handleClick.bind(this, 'ALL')} class={this.recordtype == 'ALL' ? 'panel-block is-active' : 'panel-block'}>Allergies</a>
          </div>
          <gprecord-panel section={res.entry[0].resource.section[0].text.div}></gprecord-panel>
      </div>
    );
  }
}