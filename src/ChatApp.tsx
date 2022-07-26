import {createStyles, makeStyles} from '@material-ui/core/styles';
import React, {useCallback, useEffect, useState} from 'react';
import Chip from '@material-ui/core/Chip';
import MuiInput from '@material-ui/core/Input';
import MuiButton from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import {useEvent} from './useEvent';

const Messages = React.memo(({messages, className, messageItemClassName}: any) => {
	console.count('Render Messages');
	return (
		<ul className={className}>
			{/* eslint-disable-next-line react/no-array-index-key */}
			{messages.map((message: string, index: number) => (<li key={index} className={messageItemClassName}>
				<Chip label={message} color="primary"/>
			</li>))}
		</ul>
	);
});

const Input = React.memo(({ className, onChange, text}: any) => {
	console.count('Render Input');
	return (<MuiInput onChange={onChange} value={text} className={className}/>);
});

const Button = React.memo(({onClick, children}: any) => {
	console.count('Render Button ' + children);
	return <MuiButton onClick={onClick} color="primary">{children}</MuiButton>;
});

const useStyles = makeStyles(() => createStyles({
	root: {
		display: 'flex',
		flexDirection: 'column',
		width: 400,
		alignItems: 'center',
		justifyContent: 'center',
		margin: '50px auto',
		// background: '#f8f8f8',
	},
	messages: {
		margin: '8px',
		border: '1px solid #ddd',
		borderRadius: 8,
		// background: 'white',
		width: '100%',
		minHeight: '300px',
		padding: 10,
		listStyle: 'none',
		textAlight: 'right',
	},
	messageItem: {
		marginBottom: '8px',
		display: 'flex',
		justifyContent: 'flex-end',
	},
	actions: {
		display: 'flex',
		alignItems: 'flex-start',
		width: '100%',
	},
	input: {
		flex: 1,
	}
}), {name: 'ChatApp'});

const ChatApp: React.FC = () => {
	const classes = useStyles();
	const [roomId, setRoomId] = useState(1);
	const [theme, setTheme] = useState('dark');
	const [messages, setMessages] = useState<string[]>([]);
	const [text, setText] = useState<string>('');

	const onSend = useCallback(() => {
		setMessages(msg => [...msg, text]);
		setText('');
	}, [setMessages, setText, text]);

	const onChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
		setText(e.target.value);
	}, [setText]);

	const changeRoom = useCallback(() => {
		setRoomId(roomId + 1);
	}, [roomId]);

	const changeTheme = useCallback(() => {
		setTheme(theme === 'dark' ? 'light' : 'dark');
	}, [theme]);

	const showToast = useCallback((theme: any) => {
		console.log('Showing a toast messaging using', theme);
		// console.log('Room ID', roomId);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
	//
	// const onSend = useEvent(({text, setMessages, setText}) => {
	// 	setMessages(msg => [...msg, text]);
	// 	setText('');
	// }, {setMessages, setText, text});
	//
	// const onChange = useEvent(({setText}, e: React.ChangeEvent<HTMLInputElement>) => {
	// 	setText(e.target.value);
	// }, {setText});
	//
	// const changeRoom = useEvent(({roomId, setRoomId}) => {
	// 	setRoomId(roomId + 1);
	// }, {setRoomId, roomId});
	//
	// const changeTheme = useEvent(({theme, setTheme}) => {
	// 	setTheme(theme === 'dark' ? 'light' : 'dark');
	// }, {setTheme, theme});
	//
	// const showToast = useEvent(({theme}) => {
	// 	console.log('Showing a toast messaging using', theme);
	// }, {theme});

	useEffect(() => {
		console.log(`Connecting to room ${roomId}...`);
		const timeOut = setTimeout(() => {
			console.log('Connected to room: ', roomId);
			showToast(theme);
		}, 100);

		return (): void => {
			console.log('Disconnected from: ', roomId);
			if (timeOut) {
				clearTimeout(timeOut);
			}
		};
		// return connectingHandler();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [roomId, showToast]);

	return (
		<div className={classes.root}>
			<div>
				<Button onClick={changeRoom}>Change room</Button>
				<Button onClick={changeTheme}>Change Theme</Button>
			</div>
			<Typography>
				Room ID: {roomId} - Theme: {theme}
			</Typography>
			<Messages
				className={classes.messages}
				messageItemClassName={classes.messageItem}
				messages={messages}
			/>
			<div className={classes.actions}>
				<Input
					className={classes.input}
					onChange={onChange}
					text={text}
				/>
				<Button onClick={onSend}>Send</Button>
			</div>
		</div>
	);
};

export default React.memo(ChatApp);

