import React, {useState, useEffect} from 'react'
import {NavLink, Modal, ModalHeader, ModalBody, Alert, Form, FormGroup, Label, Input, Button} from 'reactstrap'
import {useDispatch, useSelector} from 'react-redux'
import { CLEAR_ERROR_REQUEST, LOGIN_REQUEST } from '../../redux/types'


const LoginModal = () => {
    const [modal, setModal] = useState(false)
    const [localMsg, setlocalMsg] = useState('')
    const [form, setValues] = useState({
        email: "",
        password: ""
    })
    const dispatch = useDispatch()
    const {errorMsg} = useSelector((state) => state.auth)
    useEffect(()=> {
        try{
            setlocalMsg(errorMsg)
        } catch(e) {
            console.log(e)
        }
    }, [errorMsg])

    const handleToggle = () => {
        dispatch({
            type: CLEAR_ERROR_REQUEST
        })
        setModal(!modal)
    }

    const onChange = (e) => {
        setValues({
            ...form,
            [e.target.name]: e.target.value
        })
    }

    const onSubmit = (e) => {
        e.preventDefault()
        const {email, password} = form
        const user = {email, password}
        console.log(user)
        dispatch({
            type: LOGIN_REQUEST,
            payload: user
        })
    }
    return (
        <div>
            <NavLink onClick={handleToggle} href="#">
                login
            </NavLink>
            <Modal isOpen={modal} toggle={handleToggle}>
                <ModalHeader toggle={handleToggle}>Login</ModalHeader>
                <ModalBody>
                    {localMsg ? <Alert color="danger">localMSg</Alert> : null} 
                </ModalBody>
                <Form onSubmit={onSubmit}>
                    <FormGroup>
                        <Label for='email'>Email</Label>
                        <Input
                            type='email'
                            name='email'
                            id='email'
                            placeholder='Email'
                            onChange={onChange}/>
                        <Label for='password'>Email</Label>
                        <Input
                            type='password'
                            name='password'
                            id='password'
                            placeholder='password'
                            onChange={onChange}/>
                        <Button color = 'dark' style={{marginTop: '2rem'}} block>

                        </Button>
                    </FormGroup>
                </Form>
            </Modal>
        </div>
    )
}

export default LoginModal