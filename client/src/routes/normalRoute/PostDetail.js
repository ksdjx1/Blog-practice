import React, { useEffect, Fragment } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {} from 'react-helmet'
import {POST_DETAIL_LOADING_REQUEST, POST_DELETE_REQUEST, USER_LOADING_REQUEST} from '../../redux/types'
import {Button, Row, Col} from 'reactstrap'
import { CKEditor } from '@ckeditor/ckeditor5-react'
import {Link} from 'react-router-dom'

const PostDetail = (req) => {
    const dispatch = useDispatch()
    const {PostDetail, creatorId, title, loading}= useSelector((state)=> state.post)
    const {userId, userName} = useSelector((state)=> state.auth)

    useEffect(()=> {
        dispatch({
            type: POST_DETAIL_LOADING_REQUEST,
            payload : req.match.params.id
        })
        dispatch({
            type: USER_LOADING_REQUEST,
            payload: localStorage.getItem("token")
        })
    }, [])

    const onDeleteClick = () => {
        dispatch({
            type: POST_DELETE_REQUEST,
            payload : {
                id : req.match.params.id,
                token : localStorage.getItem("token")
            }
        })
    }

    const EditButton = (
        <Fragment>
            <Row className="d-flex justify-content-center pb-3">
                <Col className="col-md-3 mr-md-3">
                    <Link to="/" className="btn btn-primary btn-block">
                        Home
                    </Link>
                </Col>
                <Col className="col-md-3 mr-md-3">
                    <Link to={`/post/${req.match.params.id}/edit`} className="btn btn-success btn-block">
                        Edit Post
                    </Link>
                </Col>
                <Col className="col-md-3">
                    <Button className="btn-danger btn-block" onClick={onDeleteClick}>
                        Delete
                    </Button>
                </Col>
            </Row>
        </Fragment>
    )

    const HomeButton = (
        <Fragment>
            <Row className="d-flex justify-content-center pb-3">
                <Col className= "col-sm-12 com-md-3">
                    <Link to="/" className="btn btn-primary btn-block">
                        Home
                    </Link>
                </Col>
            </Row>
        </Fragment>
    )
    return <h1>PostDetail</h1>
}

export default PostDetail