import React, {useEffect, useState} from 'react';
import './JourneyItem.scss';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import {styled} from '@mui/material/styles';
import {IJourneyItem} from "./interfaces/IJourneyItem";
import {Box} from "@mui/material";

const Item = styled(Paper)(({theme}) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));

function JourneyItem(props: { item: IJourneyItem, launch: any }) {
    useEffect(() => {
        setItemComplete(props.item.complete)
    }, [props.item.complete]);

    const [itemComplete, setItemComplete] = useState(props.item.complete);

    return (
        <div className="journey-item">
            <Item>
                <Box sx={{display: 'flex', flexDirection: 'row'}}>
                    {itemComplete && <div className="complete-icon">✅</div>}
                    {!itemComplete && <div className="complete-icon">☐</div>}

                    <div className="content">
                        <div className="title">Article: {props.item.title}</div>
                        <div className="description">{props.item.description}</div>
                        <div className="action-buttons">
                            <Button variant="outlined" disabled={itemComplete} onClick={(e: any) => props.launch(e, props.item.id)}>Launch</Button>
                        </div>
                    </div>
                </Box>
            </Item>
        </div>
    );
}

export default JourneyItem;
