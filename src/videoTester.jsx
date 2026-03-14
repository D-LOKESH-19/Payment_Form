import React from "react";

const video1 = "https://res.cloudinary.com/dqrpzytxf/video/upload/v1773494866/TechSpark_Demo_Test_tqlu9c.mp4";
const video2 = "https://res.cloudinary.com/dqrpzytxf/video/upload/v1773496475/hadlock_intro_dlye26.mp4";

const VideoTester = () => {
return (
<div style={{ padding: "40px", textAlign: "center" }}> <h2>Cloudinary Video Test</h2>

```
  {/* Video 1 */}
  <video width="600" controls>
    <source src={video1} type="video/mp4" />
    Your browser does not support the video tag.
  </video>

  <br /><br />

  {/* Video 2 */}
  <video width="600" controls>
    <source src={video2} type="video/mp4" />
    Your browser does not support the video tag.
  </video>
</div>


);
};

export default VideoTester;
