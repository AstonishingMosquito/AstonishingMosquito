import React from 'react';
import { connection } from './LibraryModel';
import LibraryItemView from '../stateless/LibraryItemView';
import SongUploadView from '../stateless/SongUploadView';

class LibraryView extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.props.fetchSongList();
  }
  render() {
    return (
      <div>
        <SongUploadView onSubmit={this.props.onSubmit} />
        {this.props.songs.map((song) => {
          return <LibraryItemView song={song} key={song.id} />;
        })}
      </div>
    );
  }
};

export default connection(LibraryView);
