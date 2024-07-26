import {
  Button,
  CardActionArea,
  CardActions,
  CardContent,
  IconButton,
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShareIcon from "@mui/icons-material/Share";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Card from "@mui/material/Card";
import React from "react";
import { ExpandMore } from "@mui/icons-material";

function CardP({ onClick, properties }) {
  return (
    <Card sx={{ width: 250, height: 200 }}>
      <CardActionArea>
        {/* <CardMedia
        component="img"
        height="140"
        image="/static/images/cards/contemplative-reptile.jpg"
        alt="green iguana"
      /> */}
        <CardContent>
          {Object.keys(properties).map((p) => (
            <div className="flex gap-1">
              <h2 className="font-extrabold">{p}</h2>
              <h2>{properties[p]} </h2>
            </div>
          ))}
        </CardContent>
      </CardActionArea>

      <CardActions disableSpacing>
        <IconButton
          aria-label="add to favorites"
          onClick={() => {
            console.log("hola");
          }}
        >
          <FavoriteIcon />
        </IconButton>
        <IconButton aria-label="share">
          <ShareIcon />
        </IconButton>
      </CardActions>
    </Card>
  );
}

export default CardP;
