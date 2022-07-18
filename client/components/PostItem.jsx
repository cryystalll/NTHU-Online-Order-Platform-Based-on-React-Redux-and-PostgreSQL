import React from "react";
import {
  Collapse,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Table
} from "reactstrap";
import { Alert, Form, FormGroup, Label, Input, FormText } from "reactstrap";
import { Container, Row, Col } from "reactstrap";
import { Card, CardHeader, CardFooter, CardBody,
  CardTitle, CardText } from 'reactstrap';

import PropTypes from "prop-types";
import { Tooltip } from "reactstrap";

import { connect } from "react-redux";
import moment from "moment";
import DatePicker from "react-datepicker";

import { getMoodIcon } from "utilities/weather.js";
import {
  createVote,
  setTooltipToggle,
  toggleTooltip,
  setDetailToggle,
  setFormToggle,
  setFormToggleMy,
  setFormToggleMy1,
  setNoticeToggle
} from "states/post-actions.js";

////to send email to user
import emailjs from 'emailjs-com';

////我亂import的，其實感覺這樣不好
import { createForm, listForm, listEmail, postFormsCheck} from "api/forms.js";


////冰塊甜度調整
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/core/Slider';

import "./PostItem.css";

import { Auth } from "aws-amplify"; ////

class PostItem extends React.Component {
  static propTypes = {
    // id: PropTypes.number,
    // mood: PropTypes.string,
    // text: PropTypes.string,
    // clearVotes: PropTypes.number,
    // cloudsVotes: PropTypes.number,
    // drizzleVotes: PropTypes.number,
    // rainVotes: PropTypes.number,
    // thunderVotes: PropTypes.number,
    // snowVotes: PropTypes.number,
    // windyVotes: PropTypes.number,
    // tooltipOpen: PropTypes.bool,

    //// for master
    id: PropTypes.number,
    name: PropTypes.string,
    phoneNumber: PropTypes.string,
    store: PropTypes.string,
    date: PropTypes.string,
    gettime: PropTypes.string,
    place: PropTypes.string,
    fee: PropTypes.string,
    text: PropTypes.string,
    ////
    detailOpen: PropTypes.bool,
    formOpen: PropTypes.bool,
    myformOpen: PropTypes.bool,
    noticeOpen: PropTypes.bool,
    ////form data
    name: PropTypes.string,
    phone: PropTypes.string,
    drink: PropTypes.string,
    cups: PropTypes.string,
    money: PropTypes.string,
    comment: PropTypes.string,
    like: PropTypes.bool, ////暫時沒用到
    ////
    forms: PropTypes.array,
    emails: PropTypes.array,
    dispatch: PropTypes.func
  };

  constructor(props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
    ////
    this.handleClickDetail = this.handleClickDetail.bind(this);
    this.handleClickForm = this.handleClickForm.bind(this);
    ////
    this.handleSubmitForm = this.handleSubmitForm.bind(this);
    this.handleFormInputChange = this.handleFormInputChange.bind(this);
    this.handleCheckForm = this.handleCheckForm.bind(this);
    this.handleCloseForm = this.handleCloseForm.bind(this);
    this.handleClickNotice = this.handleClickNotice.bind(this);
    this.handleSubmitNotice = this.handleSubmitNotice.bind(this);
    this.handleCheckChange = this.handleCheckChange.bind(this);

    this.sugarValue = this.sugarValue.bind(this);
    this.iceValue = this.iceValue.bind(this);
    this.sugarToString = this.sugarToString.bind(this);
    this.iceToString = this.iceToString.bind(this);
    //this.addTotalMoney = this.addTotalMoney.bind(this);
    
    

    this.sugarMarks = [
      {
        value: 0,
        label: '無糖'
      },
      {
        value: 3,
        label: '微糖'
      },
      {
        value: 5,
        label: '半糖'
      },
      {
        value: 7,
        label: '少糖'
      },
      {
        value: 10,
        label: '全糖'
      }
    ];

    this.iceMarks = [
      {
        value: 0,
        label: '去冰'
      },
      {
        value: 3,
        label: '微冰'
      },
      {
        value: 5,
        label: '半冰'
      },
      {
        value: 7,
        label: '少冰'
      },
      {
        value: 10,
        label: '正常'
      }
    ];
    ////
    this.state = {
      name: "",
      phone: '',
      drink: "",
      cups: '1',
      money: '',
      comment: "",
      like: false,
      forms: [],
      emails:[],
      isintime: true,
      sugar: 5,
      ice: 5,
      totalMoney: 0 ,
      myformOpen: false
    };
  }

  render() {
    const {name,id, ts, store, date, gettime, place, fee, text, auth_email, detailOpen, formOpen, myformOpen, noticeOpen} = this.props;

    
    ////
    let isPoster = (auth_email === Auth.user.email)? true: false;
    let CheckFormText = isPoster ? "查看目前訂單" : "查看我的訂單";
    let CheckFormTitle = isPoster ? "目前訂單" : "我的訂單";
    var children;
    if(!this.state.forms.length){
      children = <div className="empty-text">目前沒有訂單</div>;
    }   
    else if (this.state.forms.length && isPoster) {
      children = this.state.forms.map(p => (
        <tr>
          <th>{p["name"]}</th>
          <td>{p["phone"]}</td>
          <td>{p["drink"]}</td>
          <td>{p["cups"]}</td>
          <td>{this.sugarToString(p["sugar"])}</td>
          <td>{this.iceToString(p["ice"])}</td>
          <td>{p["money"]}</td>
          <td>{p["comment"]}</td>
          <td><Input type='checkbox'
                  name={p['formid']}  defaultChecked = {p['check']} onChange = { e=>
                      this.handleCheckChange(e.target.name)
                    } ></Input></td>
        </tr>
      ));
      }
      else if(this.state.forms.length && !isPoster){
        children = this.state.forms.map(p => (
          <tr>
            <th>{p["name"]}</th>
            <td>{p["phone"]}</td>
            <td>{p["drink"]}</td>
            <td>{p["cups"]}</td>
            <td>{this.sugarToString(p["sugar"])}</td>
            <td>{this.iceToString(p["ice"])}</td>
            <td>{p["money"]}</td>
            <td>{p["comment"]}</td>
          </tr>
        ));
      }
      var i;
      for(i in this.state.forms){
        this.state.totalMoney += parseInt(this.state.forms[i]['money'], 10);
    }
    ////
    let ClickDetailText = detailOpen ? "Close" : "More";
    ////
    return (
      //// add Auth.user.name in ts class
      <div className='post-item d-flex flex-column' onClick={this.handleClick}>
                <div className='post d-flex'>
                    <div className='mood'><i class="fa fa-shopping-cart" aria-hidden="true"></i></div>
                    <div className='wrap'>
                        <div className='ts'><i class="fa fa-hashtag" aria-hidden="true"></i>{' '}{moment(ts * 1000).calendar()} </div>
                        <div className='shop'>{store}</div>
                    </div>
                    <Container>
                      <Row>

                      <Col></Col>
                        <Col><Button outline color="info" size="sm" onClick={this.handleClickDetail} ><i class="fa fa-bars" aria-hidden="true"></i>{' '}{ClickDetailText}</Button></Col>
                      </Row>

                      </Container>
                </div>

                <Collapse isOpen={detailOpen}>
                <div></div>
                <div></div>
                    <div>
                    <Container>

                          <Row>

                            <Col>
                            <h1 className='timechi'>
                            <Card>
                            <CardHeader tag="h6"><i class="fa fa-hourglass-half" aria-hidden="true"></i>{' '}收單Time:</CardHeader>
                            </Card>
                            </h1>

                            <CardBody>
                            <CardText>
                            <h1 className='date'>
                            {moment(date).format('MMMM D ddd')}</h1>
                            <h1 className='date'>
                            {moment(date).format('h:mm a')}</h1>
                            </CardText>
                            </CardBody>
                            </Col>
                            <Col>
                            <h1 className='timechi'>
                            <Card>
                            <CardHeader tag="h6"><i class="fa fa-gift" aria-hidden="true"></i>{' '}預計交貨Time:</CardHeader>
                            </Card>
                            </h1>
                            <CardBody>
                            <CardText>
                            <h1 className='date'>
                            {moment(gettime).format('MMMM D ddd')}</h1>
                            <h1 className='date'>
                            {moment(gettime).format('h:mm a')}</h1>
                            </CardText>
                            </CardBody>
                            </Col>
                            </Row>

                          <Row>
                          <Col>
                          <h1 className='timechi'>
                          <Card>
                          <CardHeader tag="h6"><i class="fa fa-map-marker" aria-hidden="true"></i>{' '}交貨地點:</CardHeader>
                          </Card>
                          </h1>
                          <h1 className='placechi'>
                          <CardBody>
                          <CardText>
                          {place}
                          </CardText>
                          </CardBody></h1>
                          </Col>
                          <Col>
                          <h1 className='feechi'>
                          <Card>
                          <CardHeader tag="h6"><i class="fa fa-credit-card" aria-hidden="true"></i>{' '}盈利:</CardHeader>
                          </Card>
                          </h1>
                          <h1 className='fee'>
                          <CardBody>
                          <CardText>
                          {fee}{' '}$
                          </CardText>
                          </CardBody></h1>
                          </Col>
                          </Row>
                          <Row>
                          <Col>
                          <h1 className='datechi'>
                          <Card>
                          <CardHeader tag="h6"><i class="fa fa-comments" aria-hidden="true"></i>{' '}說明：</CardHeader>
                          </Card>
                          </h1>
                          <h1 className='textschi'>
                          <CardBody>
                          <CardText>
                          {text}
                          </CardText>
                          </CardBody></h1>
                          </Col>

                         </Row>

                      </Container>

                    </div>

                    <Container>
                      <Row>
                        <div class="container">
                          <div class="row">

                          <div class="col text-right">
                          <div className='mood'><i class="fa fa-heart-o" aria-hidden="true"></i></div>
                            {this.state.isintime ?
                            (<Button outline color="info" onClick={this.handleClickForm}><i class="fa fa-users" aria-hidden="true"></i>{' '}參加</Button>):(<Button outline color="info" disabled><i class="fa fa-times" aria-hidden="true"></i>{' '}已收單</Button>)}

                            <Button outline color="info" onClick={this.handleCheckForm}><i class="fa fa-eye" aria-hidden="true"></i>{' '}{CheckFormText}</Button>
                                {isPoster  && (
                                        <Button outline color="info" onClick={this.handleClickNotice}><i class="fa fa-bell" aria-hidden="true"></i>{' '}通知集合時間</Button>
                                ) }
                            </div>
                          </div>
                        </div>
                      </Row>
                    </Container>
          <Modal isOpen={formOpen}>
            <ModalHeader>我要跟團</ModalHeader>
            <ModalBody>
              {/* form body start */}
              <Form>
                <FormGroup>
                  <Label for="exampleName">我的大名</Label>
                  <Input
                    type="text"
                    name="name"
                    id="exampleName"
                    placeholder=""
                    value={this.state.name}
                    ////when change value in value, it'll set new value in assigned props
                    onChange={this.handleFormInputChange}
                  />
                </FormGroup>
                <FormGroup>
                  <Label for="exampleNumber">我的手機</Label>
                  <Input
                    type="tel"
                    name="phone"
                    id="exampleNumber"
                    placeholder=""
                    pattern="[0-9]{4}-[0-9]{3}-[0-9]{3}"
                    value={this.state.phone}
                    onChange={this.handleFormInputChange}
                  />
                </FormGroup>
                <FormGroup>
                  <Label for="exampleDrind">今早/午/晚,我想來點...</Label>
                  <Input
                    type="text"
                    name="drink"
                    id="drink"
                    placeholder=""
                    value={this.state.drink}
                    onChange={this.handleFormInputChange}
                  />
                  <Label for="exampleSelect">數量</Label>
                  <Input
                    type="select"
                    name="cups"
                    id="exampleSelect"
                    placeholder=""
                    value={this.state.cups}
                    onChange={this.handleFormInputChange}
                  >
                    <option>1</option>
                    <option>2</option>
                    <option>3</option>
                    <option>4</option>
                    <option>5</option>
                  </Input>
                </FormGroup>
                
                <FormGroup>
                  <Typography id="discrete-slider" gutterBottom>
                      甜度
                    </Typography>
                    <Slider
                      defaultValue={5}
                      getAriaValueText={this.sugarValue}
                      aria-labelledby="discrete-slider"
                      valueLabelDisplay="auto"
                      step={null}
                      marks = {this.sugarMarks}
                      min={0}
                      max={10}
                    />
                  <Typography id="discrete-slider" gutterBottom>
                      冰量
                    </Typography>
                    <Slider
                      defaultValue={5}
                      getAriaValueText={this.iceValue}
                      aria-labelledby="discrete-slider"
                      valueLabelDisplay="auto"
                      step={null}
                      marks = {this.iceMarks}
                      min={0}
                      max={10}
                    />
                </FormGroup>

                <FormGroup>
                  <Label for="exampleMoney">總共應付金額</Label>
                  <Input
                    type="money"
                    name="money"
                    id="exampleMoney"
                    placeholder="＄花錢嘍 記得＋小費"
                    value={this.state.money}
                    onChange={this.handleFormInputChange}
                  />
                </FormGroup>
                <FormGroup>
                  <Label for="exampleText">想說的話</Label>
                  <Input
                    type="textarea"
                    name="comment"
                    id="exampleText"
                    value={this.state.comment}
                    onChange={this.handleFormInputChange}
                  />
                </FormGroup>

                <FormGroup tag="fieldset">
                          <FormGroup check>
                            <Label check>
                              <Input type="checkbox" />{' '}
                              團購網讚
                            </Label>
                          </FormGroup>
                          <FormGroup check>
                            <Label check>
                              <Input type="checkbox"/>{' '}
                              我是好寶寶遵守信用
                            </Label>
                          </FormGroup>
                          <FormGroup check>
                            <Label check>
                              <Input type="checkbox" />{' '}
                              我知道{moment(gettime).format('h:mm a')}是預計到貨時間
                            </Label>
                          </FormGroup>
                          <FormGroup check>
                            <Label check>
                              <Input type="checkbox" />{' '}
                              我知道{place}怎麼走
                            </Label>
                          </FormGroup>
                          <FormGroup check>
                            <Label check>
                              <Input type="checkbox" />{' '}
                              請隨時注意信件通知最終取貨時間
                            </Label>
                          </FormGroup>
                          </FormGroup>
              </Form>
            </ModalBody>

            <ModalFooter>
              <Button color="primary" onClick={this.handleSubmitForm}>
                Submit
              </Button>
              <Button color="secondary" onClick={this.handleClickForm}>
                Cancel
              </Button>
            </ModalFooter>
          </Modal>

          <Modal size="lg" isOpen={myformOpen}>
            <ModalHeader>{CheckFormTitle}</ModalHeader>
            <ModalBody>
              {this.state.forms.length > 0 && (
                <Table>
                  <thead>
                    <tr>
                      <td>名字</td>
                      <td>電話號碼</td>
                      <td>飲料</td>
                      <td>杯數 &nbsp;&nbsp;</td>
                      <td>甜度 &nbsp;&nbsp;</td>
                      <td>冰塊 &nbsp;&nbsp;</td>
                      <td>金額</td>
                      <td>備註</td>
                      {isPoster && (<td>是否取貨</td>)}
                    </tr>
                  </thead>
                  <tbody>{children}</tbody>
                  <div>總金額: &nbsp; {this.state.totalMoney}</div>
                </Table>
                
              )}
              {this.state.forms.length === 0 && (
                <div> 目前沒有訂單</div>
              )}
              
            </ModalBody>
            <ModalFooter>
              <Button color="secondary" onClick={this.handleCloseForm}>
                Close
              </Button>
            </ModalFooter>

          </Modal>
          <Modal isOpen = {noticeOpen}>
            <ModalHeader>寄信通知參加者取貨時間</ModalHeader>
            <ModalBody>
              <Label>取貨時間</Label>
              <h6>
              <DatePicker
                selected={this.state.pickDate}
                onChange={date => this.setState({pickDate: date})}
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={15}
                timeCaption="time"
                dateFormat="MMMM d, yyyy h:mm aa"
              />
              </h6>
              <h6>取貨地點:</h6>
              <h6>{place}</h6>


            </ModalBody>
            <ModalFooter>
              <Button color="primary" onClick={this.handleSubmitNotice}>Send</Button>{' '}
              <Button color="secondary" onClick={this.handleClickNotice}>Cancel</Button>
            </ModalFooter>
          </Modal>
        </Collapse>
        {/* */}
      </div>
    );
  }

  sugarValue(value) {
    this.state.sugar = value;
  }

  iceValue(value) {
    this.state.ice = value;
  }

  sugarToString(num) {
    var e;
    for(e in this.sugarMarks){
      //console.log(this.sugarMarks[e]['value']);
      if(this.sugarMarks[e]['value'] === num){
        return this.sugarMarks[e]['label'];
      }
    }
  }

  iceToString(num) {
    var e;
    for(e in this.iceMarks){
      //console.log(this.sugarMarks[e]['value']);
      if(this.iceMarks[e]['value'] === num){
        return this.iceMarks[e]['label'];
      }
    }
  }

  handleClick() {
    this.props.dispatch(setTooltipToggle(this.props.id, true));
  }

  //// go to post.action
  handleClickDetail() {
    this.state.isintime = (moment(this.state.now).isAfter(this.props.date))? false : true;
    this.props.dispatch(setDetailToggle(this.props.id));
  }
  ////寫的有夠爛，是不是可以先包成array再傳進來
  handleSubmitForm() {
    if(this.state.phone.length != 10){
      alert('電話號碼錯誤')
      return;
    }
    console.log("isInSubmitForm");
    //this.props.dispatch(setSubmitForm(this.props.id, this.state.name, this.state.phone, this.state.drink, this.state.cups, this.state.money, this.state.comment));
    createForm(
      this.props.id,
      this.state.name,
      this.state.phone,
      this.state.drink,
      this.state.cups,
      this.state.money,
      this.state.comment,
      this.state.sugar,
      this.state.ice,
      Auth.user.email
    );
    ////send email to logined user
    alert('成功加入囉');
    this.props.dispatch(setFormToggle(this.props.id));
    var template_params = {
      "UserMail": Auth.user.email,
      "Host":this.props.name,
      "User":this.state.inputValue,
      "Shop":this.props.store,
      'phone':this.props.phonenumber

      }
      var service_id = "default_service";
      var template_id = "send_to_user";
      let userID = "user_5GUHFsLT1VcX4hXZwhkfP"
      emailjs.send(service_id, template_id, template_params, userID);

      
      //console.log(this.props.formOpen);
  }

  ////to change formInput and store in assigned props.
  ////call formInput and go to action and reducer to set new states

  // handleFormInputChange(event){
  //   const content = event.target.value;
  //   const name = event.target.name;
  //   this.props.dispatch(formInput(name, content));
  // }

  handleFormInputChange(event) {
    //console.log(event.target.value);
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  handleClickForm() {
    this.props.dispatch(setFormToggle(this.props.id));
    //console.log(this.props.formOpen);
  }

  handleCheckForm() {
    ////use email to verify users
    if (this.props.auth_email === Auth.user.email){
      listForm(this.props.id, Auth.user.email, "poster").then(form => {
        this.state.forms = form.slice();
        this.state.totalMoney = 0;
        this.props.dispatch(setFormToggleMy(this.props.id)); 
        //console.log('check');     
      });
    }
    else{
      listForm(this.props.id, Auth.user.email, "participant").then(form => {
        this.state.forms = form.slice();
        this.state.totalMoney = 0;
        this.props.dispatch(setFormToggleMy(this.props.id));
        //console.log('check');
      });
    }
    //console.log(this.state.myformOpen);
  }

  handleCloseForm(){
    this.props.dispatch(setFormToggleMy1(this.props.id));
    postFormsCheck(this.state.forms);
    this.state.totalMoney = 0;
    //console.log(this.state.myformOpen);
  }

  handleClickNotice(){
    this.props.dispatch(setNoticeToggle(this.props.id));
  }

  handleSubmitNotice(){
    listEmail(this.props.id).then(emails =>{
      //console.log(emails);

      emails.forEach(email=> {
        var template_params = {
          "UserMail": email['auth_email'],
          "User": email['name'],
          "finaltime":moment(this.props.gettime).format('MMMM D ddd,h:mm a'),
          "place":this.props.place,
          "money":email['money'],
          "drink":email['drink'],
          "Shop":this.props.store
          }
          console.log(template_params);
        var service_id = "default_service";
        var template_id = "send_final_time";
        let userID = "user_ekyqoNqin1pEbgp3bSj7b";
        emailjs.send(service_id, template_id, template_params, userID);
      });
      this.props.dispatch(setNoticeToggle(this.props.id))
      alert('提醒參加者信件已寄出！')
    });

  }

  handleCheckChange(id){
    this.state.forms.forEach(e=>
      {
        if(id == e['formid']) e['check'] = (e['check'] === false)?true:false;
        //console.log(e['check']);
      }
      );
  }

  ////
}

export default connect((state, ownProps) => ({
  tooltipOpen: state.postItem.tooltipOpen[ownProps.id] ? true : false,
  detailOpen: state.postItem.detailOpen[ownProps.id] ? true : false,
  formOpen: state.postItem.formOpen[ownProps.id] ? true : false,
  myformOpen: state.postItem.myformOpen[ownProps.id] ? true : false,
  noticeOpen: state.postItem.noticeOpen[ownProps.id] ? true : false
}))(PostItem);
