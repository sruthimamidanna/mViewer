import React from 'react'
import collectionListStyles from '../shared/listpanel.css'
import $ from 'jquery'
import CollectionItem from './CollectionItemComponent.jsx'
import NewCollection from '../newcollection/newCollectionComponent.jsx'
import SearchInput, {createFilter} from 'react-search-input'
import service from '../../gateway/service.js';
class CollectionList extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      collections:['collection1', 'collection2', 'collection3'],
      connectionId: this.props.propps.connectionId,
      dbStats: {},
      selectedDB: this.props.selectedDB,
      visible: false,
      selectedItem: null,
      loading: 'Loading',
      searchTerm: '',
      selectedCollection:null,
      _isMounted:false
    }
  }

  clickHandler (idx,collection) {
    this.setState({selectedItem: idx});
    this.setState({ visible: false});
    this.props.setStates(collection);
    this.setState({selectedCollection : collection}, function(){
    });
  }

  refreshRespectiveData(newCollectionName) {
    this.setState({selectedCollection: newCollectionName});
    this.props.setStates(newCollectionName);
  }

  refreshCollectionList(db){
    var partialUrl = db +'/collection?connectionId=' + this.state.connectionId;
    var collectionListCall = service('GET', partialUrl, '');
    collectionListCall.then(this.success.bind(this , 'refreshCollectionList'), this.failure.bind(this , 'refreshCollectionList'));
  }

  refreshCollectionListForDelete(db){
    var partialUrl = db +'/collection?connectionId=' + this.state.connectionId;
    var collectionListCall = service('GET', partialUrl, '');
    collectionListCall.then(this.success.bind(this , 'refreshCollectionListForDelete'), this.failure.bind(this , 'refreshCollectionList'));
  }

  success(calledFrom, data) {
    if(calledFrom == 'componentDidMount'){
      this.setState({collections: data.response.result});
    }

    if(calledFrom == 'componentWillReceiveProps'){
      if (this.state._isMounted == true) {
        this.setState({collections: data.response.result});
      }
    }

    if(calledFrom == 'refreshCollectionList'){
      if(typeof(data.response.result) !== 'undefined'){
        this.setState({collections: data.response.result});
      }
      if(typeof(data.response.error) !== 'undefined'){
        if(data.response.error.code == 'DB_DOES_NOT_EXISTS'){
            this.props.refreshDb();
        }
      }
    }

    if(calledFrom == 'refreshCollectionListForDelete'){
      if(typeof(data.response.result) !== 'undefined'){
        this.setState({collections: data.response.result});
        this.props.hideQueryExecutor();
      }
      if(typeof(data.response.error) !== 'undefined'){
        if(data.response.error.code == 'DB_DOES_NOT_EXISTS'){
            this.props.refreshDb();
        }
      }

    }
  }

  failure() {

  }

  componentWillMount(){
    this.state._isMounted == true;
  }

  componentDidMount() {
    this.state._isMounted == true;
    this.setState({_isMounted : true});
    this.setState({selectedDB: this.props.selectedDB});
    var partialUrl = this.props.selectedDB +'/collection?connectionId=' + this.state.connectionId;
    var collectionListCall = service('GET', partialUrl, '');
    collectionListCall.then(this.success.bind(this , 'componentDidMount'), this.failure.bind(this , 'componentDidMount'));
  }

  componentWillReceiveProps(nextProps) {
    this.setState({selectedDB: nextProps.selectedDB});
    var partialUrl = nextProps.selectedDB +'/collection?connectionId=' + this.state.connectionId;
    var collectionListCall = service('GET', partialUrl, '');
    collectionListCall.then(this.success.bind(this , 'componentWillReceiveProps'), this.failure.bind(this , 'componentWillReceiveProps'));
  }

  componentWillUnmount(){
    this.state._isMounted = false;
  }

  searchUpdated (term) {
    this.setState({searchTerm: term})
  }

  render () {
    var that=this;
    var filteredData = null;
    if (this.state.collections != undefined){
      filteredData = this.state.collections.filter(createFilter(this.state.searchTerm));
    }
       return (
         <div className={collectionListStyles.menu} key = {this.props.visible}>
           <div className={(this.props.visible ?(this.state.visible ? collectionListStyles.visible : this.props.alignment): this.props.alignment ) }>
             <SearchInput className={collectionListStyles.searchInput} onChange={this.searchUpdated.bind(this)} />
             <h5 className={collectionListStyles.menuTitle}><NewCollection queryType= {this.props.propps.location.query.queryType} currentDb={this.props.selectedDB} currentItem={''} connectionId={this.props.propps.connectionId} addOrUpdate={'1'} refreshCollectionList={this.refreshCollectionList.bind(this)} refreshRespectiveData={this.refreshRespectiveData.bind(this)}/></h5>
               { this.state.collections != undefined ?
                 (filteredData.map((item,idx) => {
                   return(
                     <CollectionItem
                      key={item}
                      name={item}
                      dbName={this.state.selectedDB}
                      onClick={this.clickHandler.bind(this,idx,item)}
                      isSelected={this.state.selectedCollection==item}
                      connectionId={this.state.connectionId}
                      refreshCollectionList={this.refreshCollectionList.bind(this)}
                      refreshCollectionListForDelete={this.refreshCollectionListForDelete.bind(this)}
                     />)
                })): null}

            </div>
        </div>
      );
}
}

export default CollectionList;
