import React, { useEffect, Fragment } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {Helmet} from 'react-helmet'
import {POST_DETAIL_LOADING_REQUEST, POST_DELETE_REQUEST, USER_LOADING_REQUEST} from '../../redux/types'
import {Button, Row, Col, Container} from 'reactstrap'
import { CKEditor } from '@ckeditor/ckeditor5-react'
import {Link} from 'react-router-dom'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faPencilAlt, faCommentDots, faMouse} from '@fortawesome/free-solid-svg-icons'
import BalloonEditor from '@ckeditor/ckeditor5-editor-balloon/src/ballooneditor'
import Comments from '../../components/comments/Comments'
import {editorConfiguration} from '../../components/editor/EditorConfig'
import {GrowingSpinner} from '../../components/spinner/Spinner'

const PostDetail = (req) => {
    const dispatch = useDispatch()
    const {postDetail, creatorId, title, loading}= useSelector((state)=> state.post)
    const {userId, userName} = useSelector((state)=> state.auth)
    const {comments} = useSelector((state)=> state.comment)

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

    const Body = (
        <>
        {userId === creatorId ? EditButton : HomeButton}
        <Row className="border-bottom border-top border-primary p-3 mb-3 d-flex justify-content-between">
            {(()=> {
                if(postDetail && postDetail.creator) {
                    return (
                        <Fragment>
                            <div className="font-weight-bold text-big">
                                <span className="mr-3">
                                    <Button color="info">
                                        {postDetail.category.categoryName}
                                    </Button>
                                </span>
                                {postDetail.title}
                            </div>
                            <div className="align-self-end">    
                                {postDetail.creator.name}
                            </div>
                        </Fragment>
                    )
                }

            })()}
        </Row>
        {postDetail && postDetail.comments ? (
            <Fragment>
                <div className="d-flex justify-content-end align-items-baseline small">
                    <FontAwesomeIcon icon={faPencilAlt}></FontAwesomeIcon>
                    &nbsp;
                    <span>{postDetail.date}</span>
                    &nbsp;&nbsp;
                    <FontAwesomeIcon icon={faCommentDots} />
                    &nbsp;
                    <span> {postDetail.comments.length}</span>
                    &nbsp;&nbsp;
                    <FontAwesomeIcon icon={faMouse} />
                    <span>{postDetail.views}</span>
                </div>
                <Row className="mb-3">
                    <CKEditor 
                        editor={BalloonEditor}
                        data={postDetail.contents}
                        config={editorConfiguration}
                        disabled="true"
                    />
                </Row>
                <Row>
                    <Container className="mb-3 border border-blue rounded">
                        {
                            Array.isArray(comments) ? comments.map(
                            ({contents, creator, date, _id, creatorName}) => (
                                <div key={_id}>
                                    <Row className="justify-content-between p-2">
                                        <div className="font-weight-bold">
                                            {creatorName ? creatorName : creator}
                                        </div>
                                        <div className="text-small">
                                            <span className="font-weight-bold">
                                                {date.split(" ")[0]}
                                            </span>
                                            <span className="font-weight-bold">
                                                {" "}
                                                {date.split(" ")[1]}
                                            </span>
                                        </div>
                                    </Row>
                                    <Row>
                                        <div className="p-2">
                                            {contents}
                                        </div>
                                    </Row>
                                    <hr />
                                </div>
                            )) : "creator"
                        } 
                        <Comments
                            id={req.match.params.id}
                            userId={userId}
                            userName={userName}
                        />
                    </Container>
                </Row>
            </Fragment>
        ):(
            <h1>hi</h1>
        )}
        </>
    )
    return (
        <div>
            <Helmet title={`Post|${title}`}/>
            {loading === true ? GrowingSpinner : Body}
        </div>
    )
}

export default PostDetail