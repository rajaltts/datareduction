import React from 'react';
import { Col, Row, Button, Checkbox ,Skeleton, Layout, Modal, Input, Space} from 'antd';
import 'antd/dist/antd.css';
import axios from '../axios-orders';
import PlotCurve from '../components/PlotCurveComponent/PlotCurve';
import "../App.css";
import DragNDrop  from '../components/DragNDrop/DragNDrop.js'

const colors =["#e51c23", // red
"#3f51b5", // indigo
"#259b24", // green
"#9c27b0", // purple
"#00bcd4", // cyan
"#795548", // brown
"#827717", // dark lime
"#607d8b", // blue grey
"#e91e63", // pink
"#009688", // teal
"#673ab7", // deep purple

"#b0120a", // dark red
"#1a237e", // dark indigo
"#0d5302", // dark green
"#bf360c", // dark orange
"#4a148c", // dark purple
"#006064", // dark cyan
"#3e2723", // dark brown
"#263238", // dark grey
"#880e4f", // dark pink
"#004d40", // dark teal
"#311b92", // dark deep purple
"#ff5722", // dark orange (yellow)
//        "#b0120a", // light red
"#5677fc", // light blue
"#8bc34a", // light green
"#ef6c00", // light orange
"#ab47bc", // light purple
//        "#b0120a", // light cyan
"#8d6e63", // light brown
"#78909c", // light grey
//        "#b0120a", // light teal
"#b0120a", // light pink
"#7e57c2", // light deep purple
];

class DefineGroups extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loaded: false,
            groups:[],
            selectedCurves:[],
            selectedPropDef:[],
            groupSelected:[0],
            loadCurve: false,
            isModalVisible: false,
            selectedCriteria:[],
            groupsCriteria:{},
            showGroupCriteria: false,
            xtype: props.propState.xtype,
            ytype: props.propState.ytype,
            precision: 6,
        }
        this.getCurves = this.getCurves.bind(this);
        this.handleNext = this.handleNext.bind(this);
        this.onChangeCheckbox = this.onChangeCheckbox.bind(this);
        this.onSelectCriteria = this.onSelectCriteria.bind(this);
        this.sendData = this.sendData.bind(this);
        this.handlePrevious = this.handlePrevious.bind(this);
        this.openSelectCriteria = this.openSelectCriteria.bind(this);
        this.callbackFunction = this.callbackFunction.bind(this);
        this.handleCancelCriteria = this.handleCancelCriteria.bind(this);
        this.handleCreateGroup = this.handleCreateGroup.bind(this);
        this.removeExistingGroup = this.removeExistingGroup.bind(this);
        this.createGroup = this.createGroup.bind(this);
        this.updateAttribute = this.updateAttribute.bind(this);
    }

    handlePrevious() {
        let json = {
            current: 0,
            previous: true,
            selectedCurves: this.state.selectedCurves,
            groups: this.state.groups,
            type: this.state.xyDisplayScale,
            xtype: this.state.xtype,
            xunit: this.state.xunit,
            ytype: this.state.ytype,
            yunit: this.state.yunit,
            groupSelected:this.state.groupSelected,		
            selected_group: 0,
            numberOfGroups:1,
            selectedCriteria:this.state.selectedCriteria,
            groupsCriteria:this.state.groupsCriteria,
            criteria:this.state.criteria,
            targetType: this.state.targetType,
            res_curve: this.state.res_curve,
            res_var1: this.state.res_var1,
            targetClass: this.state.targetClass,
            unitSystem: this.state.unitSystem,
            xQuantityType: this.state.xQuantityType,
            yQuantityType:this.state.yQuantityType,
        }
        this.sendData(json);
    }

    openSelectCriteria(){
        this.setState({
            isModalVisible: true
        })
    }

    handleCancelCriteria(){
        this.setState({
            isModalVisible: false
        })
    }

     updateAttribute = (value,crname,index) =>{
        let group = this.state.groups[index+1];
        group.criteria[crname] = value;
        this.state.groups[index+1] = group;
        let json = {
            current: 1,
            previous: false,
            selectedCurves: this.state.selectedCurves,
            groups: this.state.groups,
            type: this.state.xyDisplayScale,
            xtype: this.state.xtype,
            xunit: this.state.xunit,
            ytype: this.state.ytype,
            yunit: this.state.yunit,
            groupSelected:this.state.groupSelected,		
            selected_group: 0,
            tree: [],
            keys: [],
            selectedCriteria:this.state.selectedCriteria,
            groupsCriteria:this.state.groupsCriteria,
            criteria:this.state.criteria,
            targetType: this.state.targetType,
            res_curve: this.state.res_curve,
            res_var1: this.state.res_var1,
            targetClass: this.state.targetClass,
            unitSystem: this.state.unitSystem,
            xQuantityType: this.state.xQuantityType,
            yQuantityType:this.state.yQuantityType,
        }
        this.sendData(json);
    }

    handleNext() {
        let treeGroup = [];
        let keysGroup = [];
        const items = this.state.groups.map((group,index) =>{
            let groupNode = {};
            let id = group.id;
            let name = group.label
            let curves =[];
            groupNode.key = (index)+"-0";
            groupNode.title = name;
            if(index===0)
                keysGroup.push(groupNode.key);
            group.curves.map((curve,index1)=>{
                let curveName = curve.name;
                let curveKey = index+"-"+(index1+1);
                if(index===0)
                    keysGroup.push(curveKey);
                let curvetree = {title:curveName,key:curveKey};
                curves.push(curvetree);
            });

            groupNode.children = curves;
            treeGroup.push(groupNode);  
            
        }
      
    );




        let json = {
            current: 2,
            previous: false,
            selectedCurves: this.state.selectedCurves,
            groups: this.state.groups,
            type: this.state.xyDisplayScale,
            xtype: this.state.xtype,
            xunit: this.state.xunit,
            ytype: this.state.ytype,
            yunit: this.state.yunit,
            groupSelected:this.state.groupSelected,		
            selected_group: 0,
            tree: treeGroup,
            keys: keysGroup,
            selectedCriteria:this.state.selectedCriteria,
            groupsCriteria:this.state.groupsCriteria,
            criteria:this.state.criteria,
            targetType: this.state.targetType,
            res_curve: this.state.res_curve,
            res_var1: this.state.res_var1,
            targetClass: this.state.targetClass,
            unitSystem: this.state.unitSystem,
            xQuantityType: this.state.xQuantityType,
            yQuantityType:this.state.yQuantityType,
            stateChanged: false,
            precision:this.state.precision,
        }
        this.sendData(json);
    }

    onChangeCheckbox(checkedValues) {
        this.state.selectedCurves = checkedValues;
    }
    

    onSelectCriteria(checkedValues){
       
        let curveMap = {};
        let curveCriteriaMap = {};
        checkedValues.map((param,index)=>{
            let obj = this.state.criteria[param];
            let values = obj.value;
            Object.keys(values).map((key, i) => {
               let curves =  values[key];
               curves.map((curve)=>{
                let c1 = curveMap[curve];
                if(c1 === undefined){
                    curveMap[curve] = param+":"+key;
                    let criObj = new Object();
                    criObj[param] = key;
                    curveCriteriaMap[curve] = criObj;
                }
                else{
                    curveMap[curve] = c1+";"+param+":"+key;
                    let criObj = curveCriteriaMap[curve];
                    criObj[param] = key;
                    curveCriteriaMap[curve] = criObj;
                }

               })
            })
            
        })
        Object.keys(this.state.criteria).map((param,index)=>{
            if(!checkedValues.includes(param)){
            let obj = this.state.criteria[param];
            let values = obj.value;
            Object.keys(values).map((key, i) => {
               let curves =  values[key];
               curves.map((curve)=>{
                let c1 = curveCriteriaMap[curve];
                if(c1 === undefined){
                    let criObj = new Object();
                    criObj[param] = key;
                    curveCriteriaMap[curve] = criObj;
                }
                else{
                    let criObj = curveCriteriaMap[curve];
                    criObj[param] = key;
                    curveCriteriaMap[curve] = criObj;
                }

               })
            })
        }
            
        })
        let groupsCriteria = {};
        Object.keys(curveMap).map((key, i) => {
            let groupKey = curveMap[key];
            let g = groupsCriteria[groupKey];
            let criteria = curveCriteriaMap[key];
            if(g === undefined){
                let curves = [key];
                g={};
                g['curves'] = curves;
            }else{
                g.curves.push(key);
            }
            g['criteria'] = criteria;
            groupsCriteria[groupKey] = g;

        })

        this.setState({
            selectedCriteria : checkedValues,
            groupsCriteria : groupsCriteria
        })
    }

    componentDidMount() {
        if(this.props.propState.groups.length == 0 ||this.props.propState.reload)
        this.getCurves();
    else{
        
        if(this.props.propState.selectedCriteria.length>0){
            this.state.showGroupCriteria = true;
        }
        this.setState({
            groups: this.props.propState.groups,
            selectedCurves: this.props.propState.selectedCurves,
            selectedPropDef : this.props.propState.selectedPropDef,
            loaded: true,
            type: this.props.propState.xyDisplayScale,
            xtype:this.props.propState.xtype,
            xunit: this.props.propState.xunit,
            ytype: this.props.propState.ytype,
            yunit: this.props.propState.yunit,		
            selected_group: 0,
            groupSelected:this.props.propState.groupSelected,		
            selectedCriteria:this.props.propState.selectedCriteria,
            groupsCriteria:this.props.propState.groupsCriteria,
            criteria:this.props.propState.criteria,
            xQuantityType: this.props.propState.xQuantityType,
            yQuantityType: this.props.propState.yQuantityType,
            precision: this.props.propState.precision,
        })
    }


        
    }

    getCurves() {
        let propDefs = [];
        console.log(this.props.propState);
        const url = this.props.propState.url;
        const query = this.props.propState.query;
        const selectedPropDef = this.props.propState.selectedPropDef;
        let selectedPropDefStr =selectedPropDef.join("','");
        selectedPropDefStr = "'"+selectedPropDefStr+"'";
        let selectedAnalysisType = this.props.propState.selectedAnalysisType.title;

        axios.get(url + '/servlet/rest/dr/get_Curve?query='+ query + '&analysisType='+selectedAnalysisType+'&propDef='+selectedPropDefStr+'&format=json&user=smroot&passwd=sdm')
            .then(response => {
                console.log(response);
                const res = response.data;
                this.setState({
                    groups: res.groups,
                    loaded: true,
                    type: res.xyDisplayScale,
                    xtype: res.xtype,
                    xunit: res.xunit,
                    ytype: res.ytype,
                    yunit: res.yunit,		
                    selected_group: 0,
                    tree: res.tree,
                    keys: res.keys,
                    criteria: res.criteria,
                    targetType: res.targetType,
                    res_curve: res.res_curve,
                    res_var1: res.res_var1,
                    targetClass: res.targetClass,
                    unitSystem: res.unitSystem,
                    xQuantityType: res.xQuantityType,
                    yQuantityType: res.yQuantityType,
                    precision:res.precision,
                    stateChanged: false
                })



            })


    }

    sendData = (result) => {
        this.props.parentCallback(result);
    }

    callbackFunction = (e) => {
        this.state.groupSelected =[];
        e.map((grp, grpI) =>  { 
               
            if(grp.isSelected){
                 this.state.groupSelected.push(grpI);
            }
        })  
        this.setState({
          groups: e ,
          loadCurve : true,
        })     
       // this.state.groups = e;
       // this.state.loadCurve = true;
        this.forceUpdate();
        //console.log(JSON.stringify(e));
        let json = {
            current: 2,
            previous: false,
            selectedCurves: this.state.selectedCurves,
            groups: this.state.groups,
            type: this.state.xyDisplayScale,
            xtype: this.state.xtype,
            xunit: this.state.xunit,
            ytype: this.state.ytype,
            yunit: this.state.yunit,
            groupSelected:this.state.groupSelected,		
            selected_group: 0,
            tree: treeGroup,
            keys: keysGroup,
            selectedCriteria:this.state.selectedCriteria,
            groupsCriteria:this.state.groupsCriteria,
            criteria:this.state.criteria,
            targetType: this.state.targetType,
            res_curve: this.state.res_curve,
            res_var1: this.state.res_var1,
            targetClass: this.state.targetClass,
            unitSystem: this.state.unitSystem,
            xQuantityType: this.state.xQuantityType,
            yQuantityType:this.state.yQuantityType,
            stateChanged: false
        }
        this.sendData(json);
    }

    removeExistingGroup(){
        let groups = this.state.groups;
        for (var i = 1; i < groups.length; i++) {
            groups[0].curves= [...groups[0].curves,...groups[i].curves]
        } 
        groups.splice(1);
        groups[0].isSelected = true;
        this.state.groups = groups;        
       
    }

    createGroup = () =>{
        let groups = this.state.groups;
        let size = this.state.groups.length;
        let row = {label:'Group '+(size),isSelected: true, isEditable:false,curves: [] , id:size, criteria: {}};
        this.state.groups = [...groups,row];
        this.state.groupSelected.push(size);
        this.state.showGroupCriteria = true;
        this.setState({
        isModalVisible: false,
        showGroupCriteria : true,        
    })
        let json = {
            current: 1,
            previous: false,
            selectedCurves: this.state.selectedCurves,
            groups: this.state.groups,
            type: this.state.xyDisplayScale,
            xtype: this.state.xtype,
            xunit: this.state.xunit,
            ytype: this.state.ytype,
            yunit: this.state.yunit,
            groupSelected:this.state.groupSelected,		
            selected_group: 0,
            tree: [],
            keys: [],
            selectedCriteria:this.state.selectedCriteria,
            groupsCriteria:this.state.groupsCriteria,
            criteria:this.state.criteria,
            stateChanged: false,
        }
        this.sendData(json);
        
    }

    handleCreateGroup = () =>{
        this.state.groupSelected =[0];
        this.removeExistingGroup();
        Object.keys(this.state.groupsCriteria).map((key, i) => {
            let curvesId = this.state.groupsCriteria[key]['curves'];
            let groups = this.state.groups;
            let curves =[];
            curvesId.map((curveId,index)=>{
                groups[0].curves.map((curve,index1)=>{
                    if(curveId === curve.oid){
                       curves.push(curve);   
                       groups[0].curves.splice(index1, 1);
                   }
                })
            })
            let size = this.state.groups.length;
            let row = {label:'Group '+(size),isSelected: true, isEditable:false,curves: curves , id:size, criteria: this.state.groupsCriteria[key].criteria};
            this.state.groups = [...groups,row];
            this.state.groupSelected.push(++i);
            this.state.showGroupCriteria = true;
       })
       if(this.state.groups.length > 1){
        this.state.groups[0].label = "Unassigned Curve";
       }
       
       this.setState({
        isModalVisible: false
    })
        let json = {
            current: 1,
            previous: false,
            selectedCurves: this.state.selectedCurves,
            groups: this.state.groups,
            type: this.state.xyDisplayScale,
            xtype: this.state.xtype,
            xunit: this.state.xunit,
            ytype: this.state.ytype,
            yunit: this.state.yunit,
            groupSelected:this.state.groupSelected,		
            selected_group: 0,
            tree: [],
            keys: [],
            selectedCriteria:this.state.selectedCriteria,
            groupsCriteria:this.state.groupsCriteria,
            criteria:this.state.criteria,
            stateChanged: false
        }
        this.sendData(json);
        
    }




    render() {

          let allCurves = [];
          let colorsArray = [];
    if(this.state.groups!==undefined && this.state.groups.length >0){
        this.state.groupSelected.map((grpIndex) =>{
           this.state.groups[grpIndex].curves.map((curve, index) =>{
                curve.marker = {color: colors[grpIndex]};
                allCurves.push(curve);
            });
        }) 
    }
   let criteria=[];
   let count = 1;
   let numberOfGroups = this.state.numberOfGroups;
   if(this.state.isModalVisible){
    Object.keys(this.state.criteria).map((key, i) => {
        let obj = new Object();
        obj["label"] = this.state.criteria[key]["label"];
        obj["value"] = key;
        criteria.push(obj);
    })
    
    if(this.state.groupsCriteria !== undefined)
        count =  Object.keys(this.state.groupsCriteria).length;

}    
 
let criteriaGrp = {};
              
                this.state.groups.map((group, index1)=>{
                 let critObj = group.criteria;
                 if(critObj !== undefined){
                    this.state.selectedCriteria.map((key, i) => {
                    let valArray = criteriaGrp[key];
                    if(valArray === undefined){
                        valArray = [];
                    }
                    valArray.push(critObj[key]===undefined?"":critObj[key]);
                    criteriaGrp[key] = valArray;
                 })}
})
    


          
let table = !(this.state.showGroupCriteria && this.state.selectedCriteria.length>0)?"":<table className="Grid">
<thead><tr key={'mattr01'}><th key='propCol0'></th>{
    
this.state.groups.map((group, index)=>{
    return(index!==0?<th style={{textAlign: 'center'}}  key={'propCol'+index+1}>{group.label}</th>:"")
})}</tr>
</thead>
<tbody>
    {
        this.state.selectedCriteria.map((cr, index) =>{
            let crObj = this.state.criteria[cr];
            let leftHeaderLabel = crObj.label;
            let values = criteriaGrp[cr];
            return(
                <tr key={'proptr'+index}>
                     <td  key={'proptd'+index} className="MatData"> <span> {leftHeaderLabel }</span></td>
                     { 
                       values!==undefined?values.map((val,i)=>{
                           return(<td><Input value={val} onChange={(e)=>this.updateAttribute(e.target.value,crObj.label,i)}style={{width:'60%'}} placeholder="" /></td>) 

                       }):""                         
                       
                     }
                </tr>
            )

        })
    }
    </tbody>
    </table>  



        return (
            <> 
                <Layout className="DRLayout">
                    <Row className="DefineGroupsDiv">
                    <Col className="DefineGroupPlot">
                    <Skeleton loading={!this.state.loaded}>
                         <PlotCurve
                        curves={allCurves} showLegend={false} isThumbnail={false} showOnlyAverage={false} xtype={this.state.xtype} ytype={this.state.ytype}
                    />
                    </Skeleton>
                    </Col>
                        <Col className="DefineGroupLayout">
                

                    <Skeleton loading={!this.state.loaded}>
                <div id='DefineGroup' className="DefineGroup">
                    <div className="DropContainer">
                        <header className="DefineDropContainer-header" >
                        <Space><Button type="primary" onClick={this.openSelectCriteria}>Select Criteria</Button><Button type="primary" onClick={this.createGroup}>Create Group</Button></Space>
                        <Modal title="Select Attributes"  visible={this.state.isModalVisible} okText="Create Groups" centered onOk={e => { this.handleCreateGroup() }} width={1000} onCancel={e => { this.handleCancelCriteria() } }>
                        <div className="criteriaDiv">
                        <Checkbox.Group options={criteria} onChange={this.onSelectCriteria} value={this.state.selectedCriteria}/>
                        </div>
                        <label>Max Number of Groups</label><Input value={count} style={{ width: '20%' }} disabled='true' defaultValue={this.state.numberOfGroups}/>
                        </Modal>
                        </header>
                    </div>

                    <div className="DropContainer">
                       { table}
                    </div>

                    

                    <div className="DropContainer">
                        <header className="DropContainer-header" >
                        <DragNDrop data={this.state.groups} parentCallback = {this.callbackFunction}/>
                        
                        </header>
                    </div>
                        
                </div>
                        </Skeleton>


             
                </Col>
               
                    </Row>
                <div className="ButtonPanel">
                    <div className="ButtonPrevious">
                        <Button  onClick={e => { this.handlePrevious() }}>Previous</Button>
                    </div>
                    <div className="ButtonNext">
                        <Button type="primary" disabled={this.state.groups.length>1?false:true} onClick={e => { this.handleNext() }}>Next</Button>
                    </div>
                </div>


                </Layout>
                
            </>
        )
    }
}

export default DefineGroups;