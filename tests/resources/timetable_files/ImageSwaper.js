/*
Title: ImageSwaper.js
	
Description:
Replace image source using altsrc attribute. Use when mouse over. 
	
Author:
Mateusz Dybalski <mateusz.dybalski[at]librus.pl>
*/

/*
  Function: ImageSwaper

    ImageSwaper object constructor.

    Author: 
    	Mateusz Dybalski <mateusz.dybalski[at]librus.pl>

    Parameters:
		void

    Returns:
		void
*/
var ImageSwaper = function()
{
	
}

ImageSwaper.instance = null;

/*
Function: GetInstance

    Get instance if exist, otherwise create Image Swaper object and return it.

	Author: 
    	Mateusz Dybalski <mateusz.dybalski[at]librus.pl>

	Parameters:
		void

	Returns:
  	    void
*/
ImageSwaper.GetInstance = function()
{
	if(ImageSwaper.instance == null) {
		ImageSwaper.instance = new ImageSwaper();
	}
	
	return ImageSwaper.instance;
}

/*
Function: Swap

  Swap source on image function.

    Author: 
  Mateusz Dybalski <mateusz.dybalski[at]librus.pl>

  Parameters:

  	    Image  img - image object on which change source.

  	      Returns:
  	    	  
  Image - image with swaped source.
*/
ImageSwaper.prototype.Swap = function(img)
{
	var tmp = img.src;
	img.src = img.ImageSwaperCache.src;
	img.ImageSwaperCache.src = tmp;
}

/*
Function: Load

  Change source value on all image on document which have altsrc attribute difrent from null.

    Author: 
  Mateusz Dybalski <mateusz.dybalski[at]librus.pl>

  Parameters:

  	    int  grade - description.

  	      Returns:
  	    	  
  int - description.
*/
ImageSwaper.prototype.Load = function()
{
	var imgs = document.getElementsByTagName('img');
	for(var i = 0; i < imgs.length; ++i) {
		if(imgs[i].getAttribute('altsrc') != null) {
			imgs[i].ImageSwaperCache = new Image();
			imgs[i].ImageSwaperCache.src = imgs[i].getAttribute('altsrc');
			imgs[i].onmouseout = imgs[i].onmouseover = function()
			{
				ImageSwaper.GetInstance().Swap(this);
			}
		}
	}
}