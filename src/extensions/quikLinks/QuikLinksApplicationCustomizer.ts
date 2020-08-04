import * as React from "react";
import * as ReactDom from "react-dom";
import { override } from '@microsoft/decorators';
import { BaseApplicationCustomizer, PlaceholderContent, PlaceholderName } from '@microsoft/sp-application-base';
import MegaMenuComponent from "./components/MegaMenuComponent";
import { IMegaMenuProps } from "./components/IMegaMenuProps";
import * as strings from 'QuikLinksApplicationCustomizerStrings';
import { sp } from "@pnp/sp";

const LOG_SOURCE: string = 'QuikLinksApplicationCustomizer';

/**
 * If your command set uses the ClientSideComponentProperties JSON input,
 * it will be deserialized into the BaseExtension.properties object.
 * You can define an interface to describe it.
 */
export interface IQuikLinksApplicationCustomizerProperties {
  // This is an example; replace with your own property
  testMessage: string;
}

/** A Custom Action which can be run during execution of a Client Side Application */
export default class QuikLinksApplicationCustomizer
  extends BaseApplicationCustomizer<IQuikLinksApplicationCustomizerProperties> {
  


  
  @override
  public onInit(): Promise<void> {
    
    sp.setup({
      sp: {
        baseUrl: this.context.pageContext.web.absoluteUrl
      },
    });

    let placeholder: PlaceholderContent;
    placeholder = this.context.placeholderProvider.tryCreateContent(PlaceholderName.Bottom);

    const element: React.ReactElement<IMegaMenuProps> = React.createElement( MegaMenuComponent );
    ReactDom.render(element, placeholder.domElement);

    return Promise.resolve();
  }
}
