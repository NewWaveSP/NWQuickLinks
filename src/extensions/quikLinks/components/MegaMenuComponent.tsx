import * as React from "react";
import * as ReactDOM from "react-dom";
import { DefaultButton } from "office-ui-fabric-react/lib/Button";
import { Panel, PanelType } from "office-ui-fabric-react/lib/Panel";
import { IMegaMenuProps } from "./IMegaMenuProps";
import { IMegaMenuState } from "./IMegaMenuState";
import styles from "./MegaMenuComponent.module.scss";
import "@pnp/polyfill-ie11";
import "core-js/es/array";
import * as es6Promise from 'es6-promise'; es6Promise.polyfill();
import { sp } from "@pnp/sp/presets/all";


export default class MegaMenuComponent extends React.Component<IMegaMenuProps, IMegaMenuState> {

  constructor(props: IMegaMenuProps) {
    super(props);

    this.state = {
      S_MenuItems: [],
      S_showPanel: false,
      S_OnlyItems: [],
      S_OnlyCategory: []
    };
  }

  public componentDidMount(): void {

    // FETCH LIST DATA

    this.getListItems();

  }

  async getListItems() {
    let results = await sp.web.lists.getByTitle("Quick Links").items.select("ID", "MegaMenuCategory", "MegaMenuMain", "MegaMenuItem").get();
    this.setState({ S_MenuItems: results })
  }

  public render(): React.ReactElement<IMegaMenuProps> {
    return (
      <div>
        <DefaultButton data-id="menuButton" className={styles.menuButton}
          title="Quick Links"
          text="Quick Links"
          ariaLabel="Quick Links"
          onClick={this.showMenu.bind(this)}
        />
        <Panel isOpen={this.state.S_showPanel} type={PanelType.smallFixedNear}
        customWidth="200px" 
        headerClassName={styles.topPanel} 
        onDismiss={this.hideMenu.bind(this)} >
        
          <div data-id="menuPanel" className={styles.grid}> 
            <div className={styles.row}> {this.bindMenu(this.state.S_MenuItems)} </div>
          </div>
        </Panel>
      </div>
    );
  }

  public showMenu(): void { this.setState({ S_showPanel: true }); }

  public hideMenu(): void { this.setState({ S_showPanel: false }); }

  public bindMenu(items) {
    if (items.length != 0) {
      let Categories = [];
      for (let i = 0; i < items.length; i++) { Categories.push(items[i].MegaMenuCategory) }
      let uniqueCategory = Categories.filter(function (item, pos) { return Categories.indexOf(item) == pos; });
      return (
        uniqueCategory.map(function (data, k) {
          return <div data-id={`${data}`} key={k} className={styles.col6} >
            <div className={styles.categoryItem}>
              {data}
            </div>
            {
              items.map(function (itemData, j) { 
                if (data == itemData.MegaMenuCategory) { return <div data-id={`${itemData.ID}`} key={j} className={styles.menuItem}> <a href={itemData.MegaMenuItem.Url}target="_blank" data-interception="off">{itemData.MegaMenuMain}</a> </div>; }
              })
            }
          </div>
        })
      );
    }
  }
}
