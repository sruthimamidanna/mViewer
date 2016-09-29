import React from 'react'
import collectionsStyles from './collections.css'
import NewCollection from '../newcollection/newCollectionComponent.jsx'
import NewDocument from '../newdocument/newDocumentComponent.jsx'
import QueryExecutor from '../queryexecutor/QueryExecutorComponent.jsx'
import CollectionList from '../collectionlist/CollectionListComponent.jsx'
import GridFSList from '../gridfslist/GridFSListComponent.jsx'
import DbStats from '../dbstats/DbStatsComponent.jsx'
import UserList from '../userlist/UserListComponent.jsx'
import $ from 'jquery'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'

class CollectionsComponent extends React.Component {

  constructor(props) {
      super(props);
      this.state = {
        selectedTab : 0,
        showQueryExecutor: false,
        selectedCollection: ''
      }
  }

  handleSelect(index){
    this.setState({selectedTab:index}, function(){
    });
  }

  componentWillReceiveProps(){
    this.setState({selectedTab:0});
    this.setState({showQueryExecutor: false});
    this.setState({selectedCollection: ''});
  }

  setStates(collection){
    this.setState({showQueryExecutor: true});
    this.setState({selectedCollection: collection});
  }

  switchTab() {
    this.setState({showQueryExecutor: false});
  }

  showQueryExecutor(){
    this.setState({showQueryExecutor: true});
  }

  hideQueryExecutor(){
    this.setState({showQueryExecutor: false});
  }

  refreshCollectionList(showQueryExecutor){
    if(typeof(this.refs.left) != 'undefined'){
      this.refs.left.refreshCollectionList(this.props.location.query.db);
    }
    if(showQueryExecutor==false){
      // alert('fdsf');
      this.setState({showQueryExecutor:showQueryExecutor});
    }
  }

  refreshRespectiveData(updatedcollectionName){
    this.refs.left.refreshRespectiveData(updatedcollectionName);
  }

  render () {
    Tabs.setUseDefaultStyles(false);
    // alert(this.props.location.query.db );
    return(
      <div className = {this.props.location.query.collapsed == 'false' ? collectionsStyles.mainContainer : collectionsStyles.mainContainer+' ' +collectionsStyles.collapsedContainer}>
        {this.props.location.query.db !== 'undefined' ? <Tabs selectedIndex={this.state.selectedTab} onSelect={this.handleSelect.bind(this)}>
          <TabList className={collectionsStyles.tabs}>
            <Tab onClick={this.switchTab.bind(this)} className={this.state.selectedTab == 0 ? collectionsStyles.activeTab : '' } >Collections</Tab>
            <Tab onClick={this.switchTab.bind(this)} className={this.state.selectedTab == 1 ? collectionsStyles.activeTab : '' }>GridFs</Tab>
            <Tab onClick={this.switchTab.bind(this)} className={this.state.selectedTab == 2 ? collectionsStyles.activeTab : '' }>Users</Tab>
            <Tab onClick={this.switchTab.bind(this)} className={this.state.selectedTab == 3 ? collectionsStyles.activeTab : '' }>Statistics</Tab>
          </TabList>
          <TabPanel>
            <div className={collectionsStyles.holder}>
              <CollectionList ref="left"  visible={true} propps = {this.props} showQueryExecutor = {this.showQueryExecutor.bind(this)} hideQueryExecutor = {this.hideQueryExecutor.bind(this)} selectedDB={this.props.location.query.db} setStates = {this.setStates.bind(this)} refreshDb = {this.props.refreshDb.bind(this)} ></CollectionList>
              {this.state.showQueryExecutor ? <QueryExecutor ref='right' refreshRespectiveData={this.refreshRespectiveData.bind(this)} refreshCollectionList={this.refreshCollectionList.bind(this)} queryType= "collection" currentDb={this.props.location.query.db} currentItem={this.state.selectedCollection} connectionId={this.props.connectionId}></QueryExecutor> : null}
            </div>
          </TabPanel>
          <TabPanel>
              <GridFSList ref="left"  visible={true} propps = {this.props} selectedDB={this.props.location.query.db} setStates = {this.setStates.bind(this)} refreshDb = {this.props.refreshDb.bind(this)} ></GridFSList>
              {this.state.showQueryExecutor ? <QueryExecutor ref='right' refreshRespectiveData={this.refreshRespectiveData.bind(this)} refreshCollectionList={this.refreshCollectionList.bind(this)} queryType= "fs" currentDb={this.props.location.query.db} currentItem={this.state.selectedCollection} connectionId={this.props.connectionId}></QueryExecutor> : null}
          </TabPanel>
          <TabPanel>
              <UserList ref="left"  visible={true} propps = {this.props} selectedDB={this.props.location.query.db} setStates = {this.setStates.bind(this)} refreshDb = {this.props.refreshDb.bind(this)} ></UserList>
              {this.state.showQueryExecutor ? <QueryExecutor ref='right' refreshRespectiveData={this.refreshRespectiveData.bind(this)} refreshCollectionList={this.refreshCollectionList.bind(this)} queryType= "fs" currentDb={this.props.location.query.db} currentItem={this.state.selectedCollection} connectionId={this.props.connectionId}></QueryExecutor> : null}
          </TabPanel>
          <TabPanel>
            <DbStats ref="left"  visible={true} connectionId = {this.props.connectionId} selectedDB={this.props.location.query.db}></DbStats>
          </TabPanel>
      </Tabs> : null}
      </div>
    );
  }
}

export default CollectionsComponent;
