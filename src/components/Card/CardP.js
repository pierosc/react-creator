import { CardActionArea, CardContent } from "@mui/material";

import Card from "@mui/material/Card";
import React from "react";

function CardP({ onClick, properties }) {
  return (
    <Card sx={{ width: "200px", height: "150px" }}>
      <CardActionArea
        sx={{ height: "100%" }}
        onClick={() => {
          onClick();
          console.log("hola");
        }}
      >
        {/* <CardMedia
        component="img"
        height="140"
        image="/static/images/cards/contemplative-reptile.jpg"
        alt="green iguana"
      /> */}
        <CardContent>
          {Object.keys(properties).map((p, index) => (
            <div className="flex gap-1" key={index}>
              <h2 className="font-extrabold">{p}</h2>
              <h2>{properties[p]} </h2>
            </div>
          ))}
        </CardContent>
      </CardActionArea>

      {/* <CardActions disableSpacing>
        <IconButton
          aria-label="add to favorites"
          onClick={() => {
            onClick();
            console.log("hola");
          }}
        >
          <FavoriteIcon />
        </IconButton>
        <IconButton aria-label="share">
          <ShareIcon />
        </IconButton>
      </CardActions> */}
    </Card>
  );
}

export default CardP;
