import React, { useEffect, useState } from 'react';
import { 
    Card, 
    CardBody, 
    CardHeader, 
    Button, 
    Form, 
    FormGroup, 
    Input, 
    FormFeedback, 
    Alert, 
    Label,
    Spinner 
} from "reactstrap";
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useTranslation } from 'react-i18next';
import { connect } from "react-redux";
import withRouter from "../../../components/withRouter";
import SideBarMenuMobile from '../../../layouts/AuthLayout/SideBarMenuMobile';
import { updateAgentData, changePassword, updateAgentAvatar } from '../../../redux/actions';

function Settings(props) {
    const { t } = useTranslation();
    const { agent } = props;
    const [selectedAvatar, setSelectedAvatar] = useState(null);

    //TODO: redevelop to flat structure into agent and remove this method
    function getAgentAvatar (){
        if (selectedAvatar !== null){
            return URL.createObjectURL(selectedAvatar);
        }

        if (agent) {
            return agent.avatar;
        }
        return "";
      }

    function submitAvatar (event){
        event.preventDefault();

        if (selectedAvatar !== null){
            const user = props.user;
            
            if (user && user.authorizedUser) {
                props.updateAgentAvatar(user.authorizedUser.id, selectedAvatar);
                return;
            }
        }

        //TODO: show exception, that avatar wasn't chosen
    }

    function getFirstName (){
        return (props.agent
        && props.agent.agent 
        && props.agent.agent.first_name) || '';
    }

    function getLastName (){
        return (props.agent
            && props.agent.agent  
            && props.agent.agent.last_name) || ''
    }

    //Filling the form after page reloading
    useEffect(() => {
        const lastName = getLastName();
        const formikLastName = personalInfoForm.values.last_name;

        if ((lastName !== "") && (formikLastName === "")) {
            personalInfoForm.setFieldValue('last_name', lastName);
        }

        const firstName = getFirstName();
        const formikFirstName = personalInfoForm.values.first_name;
        
        if ((firstName !== "") && (formikFirstName === "")) {
            personalInfoForm.setFieldValue('first_name', firstName);
        }
    }, [props.agent]);

    const personalInfoForm = useFormik({
        initialValues: {
            first_name: getFirstName(),
            last_name: getLastName(),
        },
        validationSchema: Yup.object({
            first_name: Yup.string()
                .matches(/^[^@$%&*#!?()№;~:]+$/, t('No special characters allowed'))
                .notRequired(),
            last_name: Yup.string()
                .matches(/^[^@$%&*#!?()№;~:]+$/, t('No special characters allowed'))
                .notRequired()
        }),
        onSubmit: values => {
            console.log('Settings page personalInfoForm', 'onSubmit', values);
            const user = props.user;
            if (user && user.authorizedUser) {
                props.updateAgentData(user.authorizedUser.id, values);
                return;
            } 
            //TODO: handle error if we don't have active User;
            console.log ('Settings page personalInfoForm', 'onSubmit error', "No active user");
        },
    });

    const securityForm = useFormik({
        initialValues: {
            old_password: '', // initialize with an empty string
            new_password: ''     // initialize with an empty string
        },
        validationSchema: Yup.object({
            old_password: Yup.string()  // no requirement since it's optional
                .required(t('Please enter your current password')),
            new_password: Yup.string() 
                .required(t('Please enter new password'))
                .matches(
                    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/,
                    t('The password must meet the requirements below')  // Your custom error message for simplicity
                )
        }),
        onSubmit: values => {
            console.log('Settings page securityForm', 'onSubmit', values);
            const oldPassword = values.old_password;
            const newPassword = values.new_password;
            props.changePassword(oldPassword, newPassword);
        },
    });


    //TODO: reduce number of invokes
    function getFirstNameErrors () {
        let errors = [];
        if (personalInfoForm.errors && personalInfoForm.errors.first_name) {
            errors.push(personalInfoForm.errors.first_name);
        }

        if (props.agent 
            && props.agent.agentDataErrors
            && typeof props.agent.agentDataErrors === "object"
            && props.agent.agentDataErrors.first_name) {

            errors = [...errors, ...props.agent.agentDataErrors.first_name]
        }

        return errors
    }

    //TODO: reduce number of invokes
    function getLastNameErrors () {
        let errors = [];
        if (personalInfoForm.errors && personalInfoForm.errors.last_name) {
            errors.push(personalInfoForm.errors.last_name);
        }

        if (props.agent 
            && props.agent.agentDataErrors
            && typeof props.agent.agentDataErrors === "object"
            && props.agent.agentDataErrors.last_name) {

            errors = [...errors, ...props.agent.agentDataErrors.last_name]
        }

        return errors
    }

    //TODO: reduce number of invokes
    function getOldPasswordErrors () {
        let errors = [];
        if (securityForm.errors && securityForm.errors.old_password) {
            errors.push(securityForm.errors.old_password);
        }

        if (props.auth && props.auth.changePassswordErrors 
            && typeof props.auth.changePassswordErrors === "object"
            && props.auth.changePassswordErrors.old_password) {

            errors = [...errors, ...props.auth.changePassswordErrors.old_password]
        }

        return errors
    }

    //TODO: reduce number of invokes
    function getNewPasswordErrors () {
        let errors = [];
        if (securityForm.errors && securityForm.errors.new_password) {
            errors.push(securityForm.errors.new_password);
        }

        if (props.auth && props.auth.changePassswordErrors 
            && typeof props.auth.changePassswordErrors === "object"
            && props.auth.changePassswordErrors.new_password) {

            errors = [...errors, ...props.auth.changePassswordErrors.new_password]
        }

        return errors
    }

    return (
        <React.Fragment>
            <div className="user-profile me-lg-1">
                <div className="user-profile-wrapper">
                    <div className="p-4">
                        <h4 className="mb-0">{t('Settings')}</h4>
                    </div>

                    <div className="user-profile-sroll-area">
                        {
                            (props.agent && props.agent.errors) &&
                            <Alert color="danger">{props.agent.errors}</Alert>
                        }
                        {/* Start Avatar card */}
                        <div className="p-4">
                            <Card className="border">
                                <CardHeader>
                                    {t('User\'s photo')}
                                </CardHeader>
                                <CardBody>
                                    {
                                        (props.agent && props.agent.avatarErrors 
                                            && typeof props.agent.avatarErrors === "string") &&
                                        <Alert color="danger">{props.agent.avatarErrors}</Alert>
                                    }
                                    {
                                         props.agent.avatarSuccess &&
                                         <Alert color="success">{t("The photo has been successfully updated")}.</Alert>
                                    }
                                    <Form onSubmit={submitAvatar}>
                                        <FormGroup>
                                            <Label>{t('Photo')}</Label>
                                            <div className='pb-3'>
                                            <img 
                                                src={getAgentAvatar ()} 
                                                className="rounded-circle avatar-lg img-thumbnail"
                                                />
                                            </div>
                                            <Input
                                                id="exampleFile"
                                                name="file"
                                                type="file"
                                                disabled={props.agent.avatarLoading}
                                                onChange={(e) => setSelectedAvatar(e.target.files[0])} // Handle file selection
                                            />
                                            <FormFeedback>
                                                {
                                                    props.agent 
                                                    && props.agent.avatarErrors 
                                                    && typeof props.avatarErrors === "object"
                                                    && props.agent.avatarErrors.avatar
                                                }
                                            </FormFeedback>
                                        </FormGroup>
                                        <Button type="submit" disabled={props.agent.avatarLoading}>
                                            {props.agent.avatarLoading &&
                                                <div className='pe-2 d-inline-block'>
                                                    <Spinner color="primary" size="sm"/>
                                                </div>
                                            }
                                            {t('Update')}
                                        </Button>
                                    </Form>
                                </CardBody>
                            </Card>
                        </div>
                        {/* End Avatar card */}
                        {/* Start Personal information card */}
                        <div className="p-4">
                            <Card className="border">
                                <CardHeader>
                                    {t('Personal information')}
                                </CardHeader>
                                <CardBody>
                                    {
                                        (props.agent && props.agent.agentDataErrors 
                                            && typeof props.agent.agentDataErrors === "string") &&
                                        <Alert color="danger">{props.agent.agentDataErrors}</Alert>
                                    }
                                    {
                                         props.agent.agentDataSuccess &&
                                         <Alert color="success">{t("Personal information has been successfully updated")}.</Alert>
                                    }
                                    <Form onSubmit={personalInfoForm.handleSubmit}>
                                        <FormGroup>
                                            <Label>{t('First Name')}</Label>
                                            <Input 
                                                type="text" 
                                                name="first_name" 
                                                value={personalInfoForm.values.first_name}
                                                onChange={personalInfoForm.handleChange}
                                                onBlur={personalInfoForm.handleBlur}
                                                invalid={getFirstNameErrors().length > 0 ? true : false}
                                                placeholder={t('Enter first name')}
                                                disabled={props.agent.agentDataLoading}
                                            />
                                            <FormFeedback>
                                                {
                                                    getFirstNameErrors().length > 0 && (
                                                        <ul>
                                                            {getFirstNameErrors().map((error, index) => (
                                                                <li key={index}>{error}</li>
                                                            ))}
                                                        </ul>
                                                    )
                                                }
                                            </FormFeedback>
                                        </FormGroup>

                                        <FormGroup>
                                            <Label>{t('Second Name')}</Label>
                                            <Input 
                                                type="text" 
                                                name="last_name" 
                                                value={personalInfoForm.values.last_name}
                                                onChange={personalInfoForm.handleChange}
                                                onBlur={personalInfoForm.handleBlur}
                                                invalid={getLastNameErrors().length > 0 ? true : false}
                                                placeholder={t('Enter second name')}
                                                disabled={props.agent.agentDataLoading}
                                            />
                                            <FormFeedback>
                                                {
                                                    getLastNameErrors().length > 0 && (
                                                        <ul>
                                                            {getLastNameErrors().map((error, index) => (
                                                                <li key={index}>{error}</li>
                                                            ))}
                                                        </ul>
                                                    )
                                                }
                                            </FormFeedback>
                                        </FormGroup>
                                        <Button type="submit" disabled={props.agent.agentDataLoading}>
                                            {props.agent.agentDataLoading &&
                                                <div className='pe-2 d-inline-block'>
                                                    <Spinner color="primary" size="sm"/>
                                                </div>
                                            }
                                            {t('Update')}
                                        </Button>
                                    </Form>
                                </CardBody>
                            </Card>
                        </div>
                        {/* End Personal information card */}
                        {/* Start Security section card */}
                        <div className="p-4">
                            <Card className="border">
                                <CardHeader>
                                    {t('Security section')}
                                </CardHeader>
                                <CardBody>
                                    {
                                        (props.auth && props.auth.changePassswordErrors 
                                            && typeof props.auth.changePassswordErrors === "string") &&
                                        <Alert color="danger">{props.auth.changePassswordErrors}</Alert>
                                    }
                                    {
                                         props.auth.changePasswordSuccess &&
                                         <Alert color="success">{t("The password has been successfully changed")}.</Alert>
                                    }
                                    <Form onSubmit={securityForm.handleSubmit}>
                                        <FormGroup className='border p-3'>
                                            <Label>{t('Email')}:</Label>
                                            <div>
                                                {
                                                    props.user && props.user.authorizedUser 
                                                    && props.user.authorizedUser.email ||
                                                    t('Email information not found')
                                                }
                                            </div>
                                        </FormGroup>

                                        <FormGroup>
                                            <Label>{t('Reset password')}</Label>
                                            <div className='pb-4'>
                                                <Input 
                                                    type="password" 
                                                    name="old_password" 
                                                    value={securityForm.values.old_password}
                                                    onChange={securityForm.handleChange}
                                                    onBlur={securityForm.handleBlur}
                                                    invalid={getOldPasswordErrors().length > 0 ? true : false}
                                                    placeholder={t('Enter current password')}
                                                    disabled={props.auth.changePasswordLoading}
                                                />
                                                <FormFeedback>
                                                    {
                                                        getOldPasswordErrors().length > 0 && (
                                                            <ul>
                                                                {getOldPasswordErrors().map((error, index) => (
                                                                    <li key={index}>{error}</li>
                                                                ))}
                                                            </ul>
                                                        )
                                                    }
                                                </FormFeedback>
                                            </div>
                                            
                                            <Input 
                                                type="password" 
                                                name="new_password" 
                                                value={securityForm.values.new_password}
                                                onChange={securityForm.handleChange}
                                                onBlur={securityForm.handleBlur}
                                                invalid={getNewPasswordErrors().length > 0 ? true : false}
                                                placeholder={t('Enter new password')}
                                                disabled={props.auth.changePasswordLoading}
                                            />
                                            <FormFeedback>
                                                {
                                                    getNewPasswordErrors().length > 0 && (
                                                        <ul>
                                                            {getNewPasswordErrors().map((error, index) => (
                                                                <li key={index}>{error}</li>
                                                            ))}
                                                        </ul>
                                                    )
                                                }
                                            </FormFeedback>    
                                            <ul className='pt-3'>
                                                <li>{t('At least one lowercase character')}.</li>
                                                <li>{t('At least one uppercase character')}.</li>
                                                <li>{t('At least one digit')}.</li>
                                                <li>{t('At least one special character (in this set: @ $ ! % * ? & #)')}.</li>
                                                <li>{t('At least 8 characters in total')}.</li>
                                            </ul>
                                        </FormGroup>
                                        <Button type="submit" disabled={props.auth.changePasswordLoading}>
                                            {props.auth.changePasswordLoading &&
                                                <div className='pe-2 d-inline-block'>
                                                    <Spinner color="primary" size="sm"/>
                                                </div>
                                            }
                                            {t('Update password')}
                                        </Button>
                                    </Form>
                                </CardBody>
                            </Card>
                        </div>
                        {/* End security card */}
                    </div>
                    {/* End User profile description */}   
                </div>
                {/* End scroll areaa */} 
                <SideBarMenuMobile /> 
            </div>
        </React.Fragment>
    );
}

//TODO: suscribe only to required fields
const mapStateToProps = (state) => ({
    agent: state.Agent,
    user: state.User,
    auth: state.Auth
});

const mapDispatchToProps = {
    updateAgentData,
    changePassword,
    updateAgentAvatar
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Settings));