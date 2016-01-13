import React from 'react';
import PlayerStore from '../../store';
import SubStore from './store';
import ls from 'local-storage';

export
default React.createClass({

    getInitialState() {
        var playerState = PlayerStore.getState();
        var subState = SubStore.getState();
        return {
            text: '',
            size: (subState.size * (ls('customSubSize') / 100)),
            visibility: !(playerState.playlistOpen || playerState.settingsOpen),
            color: ls.isSet('subColor') ? ls('subColor') : 0,
            hex: ['#fff', '#ebcb00', '#00e78f', '#00ffff', '#00b6ea'],
            subBottom: subState.marginBottom
        }
    },
    componentWillMount() {
        PlayerStore.listen(this.update);
        SubStore.listen(this.update);
        PlayerStore.getState().events.on('subtitleUpdate', this.update);
    },

    componentWillUnmount() {
        PlayerStore.unlisten(this.update);
        SubStore.unlisten(this.update);
        PlayerStore.getState().events.removeListener('subtitleUpdate', this.update);
    },
    update() {
        if (this.isMounted()) {
            var playerState = PlayerStore.getState();
            var subState = SubStore.getState();
            this.setState({
                text: subState.text,
                size: (subState.size * (ls('customSubSize') / 100)),
                visibility: !(playerState.playlistOpen || playerState.settingsOpen),
                color: ls.isSet('subColor') ? ls('subColor') : 0,
                subBottom: subState.marginBottom
            });
        }
    },
    render() {
        var style = {
            fontSize: this.state.size,
            zIndex: this.state.visibility ? '10' : '1',
            color: this.state.hex[this.state.color],
            bottom: this.state.subBottom
        };
        return (
            <span className='wcjs-subtitle-text' style={style} dangerouslySetInnerHTML={{__html: this.state.text}} />
        );
    }
});
