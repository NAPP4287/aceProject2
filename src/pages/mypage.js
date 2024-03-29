import {useEffect, useState} from "react";
import {axiosApiInstance} from "../common/axiosToken";
import {ContentAllBox, ContentListWrap, TableBox} from "../style/styleMain";
import {saveContentData, contentDataStatus} from "../redux/content/contentData";
import {modalDetailStatus} from "../redux/modal/modalOpen";
import {useDispatch, useSelector} from "react-redux";
import {editOpen,deleteOpen} from "../redux/modal/modalOpen";
import ModalEdit from "../component/modalEditContent";
import ModalDelete from "../component/modalDeleteContent";

function Mypage () {
    const resultBtn = [];
    const [allPageNumber, setAllPageNumber] = useState(0);
    const [onColor, setOnColor] = useState(0);
    const [boardId, setBoardId] = useState(0);
    const dispatch = useDispatch();
    const contentData = useSelector(contentDataStatus);
    const detailModalStatus = useSelector(modalDetailStatus);

    useEffect(() => {
        axiosApiInstance.get(`/api/my-post`, {
            params : {
                size : 10,
                page : 0
            }
        }).then((res) => {
            dispatch(saveContentData({contentData : res.data.response.content}));
            setAllPageNumber(res.data.response.totalPages);
        })
    }, []);

    for(let i = 0; i < allPageNumber; i++){
        resultBtn.push(i);
    }

    const nextMypage = (btnIdx) => {
        axiosApiInstance.get(`/api/my-post`, {
            params : {
                size : 10,
                page : btnIdx
            }
        }).then((res) => {
            dispatch(saveContentData({contentData : res.data.response.content}));
            setOnColor(btnIdx);
        })
    }

    const editOrDeleteContentModalOpen = (boardId, modalName) => {
        if(modalName === 'edit'){
            dispatch(editOpen());
        }else{
            dispatch(deleteOpen());
        }
        setBoardId(boardId);
    }

    return (
        <ContentAllBox>
            {detailModalStatus.editModalOpen ? <ModalEdit boardId={boardId} /> : null}
            {detailModalStatus.deleteModalOpen ? <ModalDelete boardId={boardId} /> : null}
            <ContentListWrap>
                <TableBox>
                    <thead>
                    <tr>
                        <th>Content Id</th>
                        <th>Title</th>
                        <th>삭제하기</th>
                        <th>수정하기</th>
                    </tr>
                    </thead>
                    <tbody>
                    {contentData.contentData.map((el, idx) => <tr key={idx}>
                        <td>
                            {el.boardId}
                        </td>
                        <td>
                            {el.title}
                        </td>
                        <td>
                            {el.delete === 1 ? "삭제된 항목입니다." : <button onClick={() => editOrDeleteContentModalOpen(el.boardId, 'delete')}>삭제하기</button>}
                        </td>
                        <td>
                            {el.delete === 1 ? <button disabled>수정하기</button> : <button onClick={() => editOrDeleteContentModalOpen(el.boardId, 'edit')}>수정하기</button>}
                        </td>
                    </tr>)}
                    </tbody>
                </TableBox>
            </ContentListWrap>
            {resultBtn.map((el) =>
                <button key={el} onClick={() => nextMypage(el)} style={el === onColor ? {backgroundColor : "#FF4F83", color : "white", transition : "0.4s"} : {backgroundColor : "white", transition : "0.4s"}}>{el + 1}</button>)}
        </ContentAllBox>
    )
}

export default Mypage