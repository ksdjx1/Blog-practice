import React, { useEffect, useRef, useState } from 'react'
import { useDispatch } from 'react-redux'
import { Form, Button, Input, FormGroup, Row } from 'reactstrap'
import { COMMENT_LOADING_REQUEST, COMMENT_UPLOADING_REQUEST } from '../../redux/types'

const Comments = ({id, userName, userId}) => {
    const dispatch = useDispatch()
    const [form, setValues] = useState({contents: ""})
    
    const onSubmit = async(e) => {
        await e.preventDefault()
        const {contents} = form
        const token = localStorage.getItem("token")
        const body = {
            contents, token, id, userId, userName
        }

        dispatch({
            type: COMMENT_UPLOADING_REQUEST,
            payload: body
        })
        resetValue.current.value=''
        setValues('')
    }

    const resetValue= useRef(null)

    useEffect(()=> {
        dispatch({
            type: COMMENT_LOADING_REQUEST,
            payload: id
        })
    }, [dispatch, id])

    const onChange = (e) => {
        setValues({
            ...form,
            [e.target.name] : e.target.value
        })
    }

    return (
        <>
            <Form onSubmit={onSubmit}>
                <FormGroup>
                    <Row className="p-2">
                        <div className="font-weight-bold m-1">Make Comment</div>
                        <div className='my-1'></div>
                        <Input
                            innerRef={resetValue}
                            type="textarea"
                            name="contents"
                            id='contents'
                            onChange={onChange}
                            placeholder="Comment"
                        />
                        <Button
                            color="primary"
                            block
                            className="mt-2 offset-md-10 col-md-2"
                        >Submit</Button>
                    </Row>
                </FormGroup>
            </Form>
        </>
    )
}

export default Comments