import React from 'react';
import PropTypes from 'prop-types';
import {Collapse, Modal, ModalHeader, ModalBody, ModalFooter} from 'reactstrap';
import {  Form, FormGroup, Label, FormText } from 'reactstrap';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import CreatableSelect from 'react-select/creatable';

import {
    Alert,
    Input,
    Button,
    ButtonDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem
} from 'reactstrap';
import moment from 'moment'
import {connect} from 'react-redux';
////to send email to user
import emailjs from 'emailjs-com';

import {getMoodIcon} from 'utilities/weather.js';
import {createPost, input, inputDanger, toggleMood, setMoodToggle, selectMood,setFormTogglemain} from 'states/post-actions.js';


import './PostForm.css';
import { Auth } from 'aws-amplify';

class PostForm extends React.Component {
    static propTypes = {
        formOpen: PropTypes.bool,
        dispatch: PropTypes.func
    };

    constructor(props) {
        super(props);

        this.handleClickForm = this.handleClickForm.bind(this);
        this.handleSubmitForm = this.handleSubmitForm.bind(this);
        this.state = {
            name: '',
            phoneNumber: '',
            store: '',
            date: new Date(),
            gettime:new Date(),
            place:'',
            fee: '0',
            text: ''
        }
    }

    render() {
        const {formOpen} = this.props;

        return (
          <div className='post-form'>

              <Button color="info" size="lg" onClick={this.handleClickForm}><i class="fa fa-share" aria-hidden="true"></i>{' '}揪團去</Button>
                <Modal isOpen = {formOpen}>
                  <ModalHeader>一起愉快開團</ModalHeader>

                    <ModalBody>
                      <Label>我的名字</Label>
                      <Input
                        type="text"
                        name="name"
                        value={this.state.name}
                        onChange={
                                  (event)=>
                                    {if(event.target.name === "name")
                                      this.setState({name: event.target.value})}
                                 }
                      />

                      <Label>我的手機</Label>
                        <Input
                          type="text"
                          name="phoneNumber"
                          value={this.state.phoneNumber}
                          onChange={
                                    (event)=>
                                      {if(event.target.name === "phoneNumber")
                                        this.setState({phoneNumber: event.target.value})}
                                   }
                        />

                      <Label>想訂哪家</Label>
                      <CreatableSelect
                        isClearable
                        placeholder="沒有想要的嗎？"
                        onChange={store => this.setState({store: store['value']})}
                        options={[
                          { value: '茶湯會', label: '茶湯會' },
                          { value: 'Coco', label: 'Coco' },
                          { value: '迷客夏', label: '迷客夏' },
                          { value: '清心福全', label: '清心福全' },
                          { value: '珍煮丹', label: '珍煮丹' },
                          { value: '河堤上的貓', label: '河堤上的貓' },
                          { value: '麻古茶坊', label: '麻古茶坊' },
                          { value: '50嵐', label: '50嵐' },
                          { value: '一芳水果茶', label: '一芳水果茶' },
                          { value: '大苑子', label: '大苑子' },
                          { value: '老虎堂', label: '老虎堂' },
                          { value: '小澤宅宅', label: '小澤宅宅' },
                          { value: '日出茶太', label: '日出茶太' },
                          { value: '糖奶奶', label: '糖奶奶' }
                        ]}
                      />

                      <Label>收單時間</Label>
                      <h6>
                        <DatePicker
                          selected={this.state.date}
                          onChange={date => this.setState({date: date})}
                          showTimeSelect
                          timeFormat="HH:mm"
                          timeIntervals={15}
                          timeCaption="time"
                          dateFormat="MMMM d, yyyy h:mm aa"
                        />
                      </h6>
                      <Label>預計交貨時間</Label>
                      <h6>
                        <DatePicker
                          selected={this.state.gettime}
                          onChange={date => this.setState({gettime: date})}
                          showTimeSelect
                          timeFormat="HH:mm"
                          timeIntervals={15}
                          timeCaption="time"
                          dateFormat="MMMM d, yyyy h:mm aa"
                        />
                      </h6>
                      <Label>交貨地點</Label>
                        <Input
                          type="text"
                          name="place"
                          value={this.state.place}
                          onChange={
                                    (event)=>
                                      {if(event.target.name === "place")
                                        this.setState({place: event.target.value})}
                                   }
                        />
                      <Label>我好累要小費</Label>
                      <Input
                        type="select"
                        name="fee"
                        value={this.state.fee}
                        onChange={
                                  (event)=>
                                    {if(event.target.name === "fee")
                                      this.setState({fee: event.target.value})}
                                 }
                      >
                        <option value='不收錢的佛心賣家'>我很佛不收</option>
                        <option value='5'>5$</option>
                        <option value='10'>10$</option>
                      </Input>

                      <Label>我想跟大家說...</Label>
                      <Input
                        type="text"
                        name="text"
                        placeholder="我人真好"
                        value={this.state.text}
                        onChange={
                                  (event)=>
                                    {if(event.target.name === "text")
                                      this.setState({text: event.target.value})}
                                 }

                      />
                    </ModalBody>

                    <ModalFooter>
                      <Button color="primary" onClick={this.handleSubmitForm}>Submit</Button>
                      <Button color="secondary" onClick={this.handleClickForm}>Cancel</Button>
                    </ModalFooter>

                  </Modal>

              </div>
        );
    }

    handleSubmitForm(){
      if(this.state.phoneNumber.length != 10){
        alert('電話號碼錯誤')
        return;
      }

      var template_params = {
      "UserMail": Auth.user.email,
      "User":this.state.name,
      "Shop":this.state.store,
      "Date":moment(this.state.date).format('MMMM D ddd,h:mm a')
      }
      var service_id = "default_service";
      var template_id = "send_to_host";
      let userID = "user_5GUHFsLT1VcX4hXZwhkfP"
      emailjs.send(service_id, template_id, template_params, userID);

        this.props.dispatch(createPost(this.state, Auth.user.email, this.props.isMyPost));
        this.props.dispatch(setFormTogglemain());
    }

    handleClickForm(){
        this.props.dispatch(setFormTogglemain());
    }

}




export default connect((state )=> ({
    ...state.postForm,
    formOpen: state.postForm.formOpen ? true:false
}))(PostForm);
