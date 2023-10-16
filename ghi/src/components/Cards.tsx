type VideoCardProps = {
  videoURL: string;
};

export const VideoCard: React.FC<VideoCardProps> = ({
  videoURL = 'https://www.youtube.com/watch?v=dwaqr2w3uqQ',
}) => {
  const translateToEmbedURL = (url: string) => {
    const autoPlay = 'autoplay=0';
    const mute = 'mute=0';
    if (url.includes('list=') && url.includes('v=')) {
      const videoId = url.split('v=')[1].split('&')[0];
      return `https://www.youtube.com/embed/${videoId}?${autoPlay}&${mute}`;
    }
    if (url.includes('v=')) {
      const videoId = url.split('v=')[1];
      return `https://www.youtube.com/embed/${videoId}?${autoPlay}&${mute}`;
    }
    return url;
  };

  return (
    <div>
      <div className="container" id="resource-container">
        <h5 className="mb-2 text-primary">Videos</h5>
        <div className="row">
          <div className="col">
            <div className="resource-card">
              <iframe
                src={translateToEmbedURL(videoURL)}
                allowFullScreen
              ></iframe>
            </div>
          </div>
          <div className="col">
            <div className="resource-card">
              <iframe
                src={translateToEmbedURL(videoURL)}
                allowFullScreen
              ></iframe>
            </div>
          </div>
          <div className="col">
            <div className="resource-card">
              <iframe
                src={translateToEmbedURL(videoURL)}
                allowFullScreen
              ></iframe>
            </div>
          </div>
          <div className="col">
            <div className="resource-card">
              <iframe
                src={translateToEmbedURL(videoURL)}
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

type ImageCardProps = {
  imageURL: string;
};

export const ImageCard: React.FC<ImageCardProps> = ({
  imageURL = 'https://cdn.dribbble.com/userupload/10723140/file/original-7615d466262d072471dc897b199cc05f.png?resize=752x',
}) => {
  return (
    <div>
      <div className="container" id="resource-container">
        <h5 className="mb-2 text-primary">Images</h5>
        <div className="row">
          <div className="col">
            <div className="resource-card">
              <img src={imageURL} alt="Resource" />
            </div>
          </div>
          <div className="col">
            <div className="resource-card">
              <img src={imageURL} alt="Resource" />
            </div>
          </div>
          <div className="col">
            <div className="resource-card">
              <img src={imageURL} alt="Resource" />
            </div>
          </div>
          <div className="col">
            <div className="resource-card">
              <img src={imageURL} alt="Resource" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
