import React from 'react';
import './App.scss';
import Stack from '@mui/material/Stack';
import {IJourneyItem} from "./IJourneyItem";
import JourneyItem from "./JourneyItem";
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import {TransitionProps} from '@mui/material/transitions';

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement;
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const journeyItems: IJourneyItem[] = [
    {
        id: 0,
        title: "This Article",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
        complete: true
    },
    {
        id: 1,
        title: "Another Article",
        description: "In dictum non consectetur a. Massa tempor nec feugiat nisl pretium fusce. Aliquet nibh praesent tristique magna sit. Massa ultricies mi quis hendrerit dolor magna eget est lorem. Fringilla phasellus faucibus scelerisque eleifend donec. Non tellus orci ac auctor augue mauris augue. Urna porttitor rhoncus dolor purus. Fringilla urna porttitor rhoncus dolor purus. Elit at imperdiet dui accumsan sit amet nulla. Hendrerit dolor magna eget est lorem ipsum dolor.",
        complete: false
    },
    {
        id: 2,
        title: "Fascinating Article",
        description: "Fusce ut placerat orci nulla pellentesque. Massa sapien faucibus et molestie ac feugiat sed. Penatibus et magnis dis parturient montes nascetur ridiculus. Eget aliquet nibh praesent tristique. Augue interdum velit euismod in pellentesque massa placerat. Sit amet aliquam id diam maecenas ultricies mi eget. At consectetur lorem donec massa. Pellentesque id nibh tortor id aliquet lectus proin. Cras tincidunt lobortis feugiat vivamus at augue eget arcu dictum. Sociis natoque penatibus et magnis dis parturient montes nascetur ridiculus. Volutpat commodo sed egestas egestas fringilla phasellus faucibus scelerisque eleifend.",
        complete: false
    }
];

function App() {
    const [items, setItems] = React.useState(journeyItems);
    const [open, setOpen] = React.useState(false);
    const [selectedItem, setSelectedItem] = React.useState(0);

    const handleClickOpen = (_event: any, index: number) => {
        console.log(`launching ${index}`);
        setSelectedItem(index);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <div className="App">
            <div className="page-header">
                <div className="page-title">Journeys Demo</div>
                <div className="introduction">
                    Sit amet purus gravida quis blandit. Purus semper eget duis at tellus. Ac turpis egestas integer eget aliquet. Vel facilisis volutpat est
                    velit egestas dui id ornare. Sit amet porttitor eget dolor. Pretium aenean pharetra magna ac placerat. Magna fermentum iaculis eu non.
                    Libero justo laoreet sit amet cursus sit amet. Odio aenean sed adipiscing diam donec adipiscing. Sed ullamcorper morbi tincidunt ornare
                    massa eget egestas. Id ornare arcu odio ut sem nulla pharetra diam.
                </div>
            </div>

            <Stack spacing={2}>
                <JourneyItem item={items[0]} launch={handleClickOpen}></JourneyItem>
                <JourneyItem item={items[1]} launch={handleClickOpen}></JourneyItem>
                <JourneyItem item={items[2]} launch={handleClickOpen}></JourneyItem>
            </Stack>

            <Dialog
                fullScreen
                open={open}
                onClose={handleClose}
                TransitionComponent={Transition}
            >
                <AppBar sx={{position: 'relative'}}>
                    <Toolbar>
                        <IconButton
                            edge="start"
                            color="inherit"
                            onClick={handleClose}
                            aria-label="close"
                        >
                            <CloseIcon/>
                        </IconButton>
                        <Typography sx={{ml: 2, flex: 1}} variant="h6" component="div">
                            Article: {items[selectedItem].title}
                        </Typography>
                        <Button autoFocus color="inherit" onClick={() => {
                            let newArr = [...items];
                            newArr[selectedItem].complete = true;
                            console.dir(newArr);
                            setItems(newArr);
                            handleClose()
                        }}>
                            Mark Read
                        </Button>
                    </Toolbar>
                </AppBar>
                <div className="article-content">
                    {items[selectedItem].description}
                </div>
            </Dialog>
        </div>
    );
}

export default App;
