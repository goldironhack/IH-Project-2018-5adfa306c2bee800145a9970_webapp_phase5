const NEIGHBORHOOD_NAMES = "https://data.cityofnewyork.us/api/views/xyye-rtrs/rows.json?accessType=DOWNLOAD";
const DISTRICT_GEOSHAPES = "https://services5.arcgis.com/GfwWNkhOj9bNBqoJ/arcgis/rest/services/nycd/FeatureServer/0/query?where=1=1&outFields=*&outSR=4326&f=geojson";
const CRIMES = "https://data.cityofnewyork.us/api/views/qgea-i56i/rows.json?accessType=DOWNLOAD";
const HOUSING = "https://data.cityofnewyork.us/api/views/hg8x-zxpr/rows.json?accessType=DOWNLOAD";

var testingArrange =
{
	"1" : ["test1"],
	"2" : ["test2"],
	"3" : ["test3"],
	"4" : ["test4"],
	"5" : ["test5"],
	"6" : ["test6"],
	"7" : ["test7"],
	"8" : ["test8"],
	"9" : ["test9"],
	"10" : ["test10"]
};

var ids = Object.keys( testingArrange );
var map;
var polygons;
var marker;
var bounds;

var myDistance = 0;
var flag = false;


var distance;
	var auxDistance;
	var auxThePolygon;
	var thePolygon;
	var cont;
	var aux;


function whatodo( _myJson, _URL, _map )
{
	if( _URL === NEIGHBORHOOD_NAMES )
	{

	}
	else if( _URL === DISTRICT_GEOSHAPES )
	{
		polygons = new Array( 5 );
		var color = 0;
		var boro;
		var cd;
		var coords;
		marker = new Array( 5 );
		bounds = new Array( 5 );
		for( i = 0; i < 5; i++ )
		{
			polygons[i] = new Array( 30 );
			marker[i] = new Array( 30 );
			bounds[i] = new Array( 30 );
			//for( j = 0; j < 100; j++ ) polygons[i][j] = new Array( 2 );
		}
			//for(j = 0; j < 80; j++ ) bounds[j] = new  google.maps.LatLngBounds( );

		for( i = 0; i < _myJson.features.length; i++ )
		{
			boro = Math.floor( _myJson.features[i].properties.BoroCD / 100 );
			cd = _myJson.features[i].properties.BoroCD - ( boro * 100 );
			aux_coords = new Array( );
			coords = new Array( );
			bounds[boro - 1][cd - 1] = new  google.maps.LatLngBounds( );
			if( _myJson.features[i].geometry.coordinates.length === 1 )
			{
				for( k = 0; k < _myJson.features[i].geometry.coordinates[0].length; k++ )
				{
					aux_coords[k] = 
					{
						lat: _myJson.features[i].geometry.coordinates[0][k][1], 
						lng: _myJson.features[i].geometry.coordinates[0][k][0]
					};
					bounds[boro - 1][cd - 1].extend( aux_coords[k] );
				}
				coords[0] = aux_coords;
				
			}
			else
			{
				for( j = 0; j < _myJson.features[i].geometry.coordinates.length; j++ )
				{
					aux_coords = new Array( );
					for( k = 0; k < _myJson.features[i].geometry.coordinates[j][0].length; k++ )
					{
						aux_coords[k] = 
						{
							lat: _myJson.features[i].geometry.coordinates[j][0][k][1], 
							lng: _myJson.features[i].geometry.coordinates[j][0][k][0]
						};
						//if( j === 0 )
						bounds[boro - 1][cd - 1].extend( aux_coords[k] );
					}
					coords[j] = aux_coords;
					
				}
			}
			
			//console.log('' + ( boro - 1 ) + ', ' + ( cd - 1 ) );
			if( boro === 2 & cd > 12 | boro === 3 & cd > 18 | boro === 1 & cd > 12 | boro === 4 & cd > 14 | boro === 5 & cd > 3 )
			{
				var nonhabitable = new google.maps.Polygon
				({
					paths: coords,
					strokeColor: '#000000',
          		strokeOpacity: 0.8,
          		strokeWeight: 0.5,
          		fillColor: '#5a5553',
          		fillOpacity: 0.5
				});
				nonhabitable.setMap( _map );
				continue;

			}
			/*color = color + 167772;
			var hexColor = color.toString( 16 );
			while( hexColor.length < 6 ) hexColor = '0' + hexColor;
			hexColor = '#' + hexColor;
			console.log(hexColor);*/
			if( boro == 1 ) hexColor = '#e74c3c';
			else if( boro == 2) hexColor = '#8e44ad';
			else if( boro == 3) hexColor = '#3498db';
			else if( boro == 4) hexColor = '#2ecc71';
			else if( boro == 5) hexColor = '#f4d03f';
			polygons[boro - 1][cd - 1] = new google.maps.Polygon
			({
				paths: coords,
				strokeColor: '#000000',
          	strokeOpacity: 0.8,
          	strokeWeight: 0.5,
          	fillColor: /*'#AA1000'*/hexColor,
          	fillOpacity: 0.3
			});
			polygons[boro - 1][cd - 1].setMap( _map );
			marker[boro - 1][cd - 1] = new google.maps.Marker
			({
    			position: bounds[boro - 1][cd - 1].getCenter( ),
    			label: '' + boro + '' + cd,
    			map: _map,
    			title: _myJson.features[i].id.toString( )
  			});
			polygons[boro - 1][cd - 1].addListener( 'click', function( e ){polygonClick( e, boro, cd, _map );} );
			/*var message = new google.maps.InfoWindow;
			message.setContent( 'boro: ' + boro + 'cd: ' + cd );
  			 message.setPosition( /*coords[coords.length - 1][coords[coords.length - 1].length -1]*//*bounds[i].getCenter( ) );
			message.open( _map );*/
		}
	}
	else if( _URL === CRIMES )
	{

	}
	else if( _URL === HOUSING ) 
	{

	}

}

function polygonClick( e, boro, cd, _map )
{
	var message = new google.maps.InfoWindow( );
	message.setContent( 'boro: ' + boro + ', cd: ' + cd );
   message.setPosition( e.latLng );
	//message.open( polygon.get( 'map' ) );
	message.open( _map );
}

function getDataSet( _URL, _map )
{
	var xhttp = new XMLHttpRequest( );
 	xhttp.onreadystatechange = function( )
 	{
  		if( this.readyState == 4 && this.status == 200 )
  		{
  			var myJson = JSON.parse( this.responseText );
  			whatodo( myJson, _URL, _map );
  		}
  	};
  xhttp.open( "GET", _URL, true );
  xhttp.send( );
}


/* HERE I GET DATASET
function getDataFromURL( URL )
{
	var data = $.get( URL, function( )
		{
			console.log( URL )
		} 
	)
	.done( function( )
		{
			//Success
			//console.log(data);
			DATASETS_API_SERIES_ID[data.responseJSON.request.series_id].push(data.responseJSON.series[0].data);
		}
	)
	.fail( function( error )
		{
			console.error( error );
		}
	)
}
*/

function getTopD( )
{
	distance = new Array( );
	thePolygon = new Array( );
	cont = 0;
	for( i = 0; i < 5; i++ )
	{
		if( i === 0 | i == 1 ) aux = 12;
		else if( i == 2 ) aux = 18;
		else if( i == 3 ) aux = 14;
		else if( i == 4 ) aux = 3;
		for( j = 0; j < aux; j++ )
		{
			var service = new google.maps.DistanceMatrixService();
			service.getDistanceMatrix
			({
   			origins: [bounds[i][j].getCenter( )],
   			destinations: [{ lat: 40.7291, lng: -73.9965 }],
  				travelMode: 'DRIVING',
   			avoidHighways: false,
  				avoidTolls: false,
  			}, callback );
  			//waitFlag( );
  			flag = false;
  			console.log(myDistance);
			distance[cont] = myDistance;
			thePolygon[cont++] = { polygon: polygons[i][j], marker: marker[i][j], boroCD: ( ( i + 1 ) * 100 ) + j + 1  };
		}
	}
	for( i = 0; i < distance.length; i++ )
	{
		for( j = 0; j < distance.length - i + 1; j++ )
		{
			if( distance[j] > distance[j + 1] )
			{
				auxDistance = distance[j + 1];
				distance[j + 1] = distance[j];
				distance[j] = auxDistance;

				auxThePolygon = thePolygon[j + 1];
				thePolygon[j + 1] = thePolygon[j];
				thePolygon[j] = auxThePolygon;
			}
		}
	}
	updateTablePrima( distance, thePolygon, 10 );
}

function callback(response, status)
{
  if (status == 'OK')
  {
    var origins = response.originAddresses;
    var destinations = response.destinationAddresses;

    for (var i = 0; i < origins.length; i++)
    {
      var results = response.rows[i].elements;
      for (var j = 0; j < results.length; j++)
      {
        var element = results[j];
        myDistance = element.distance.value;
        console.log("entra a callback");
      }
    }
    flag = true;
  }
}

function waitFlag( )
{
    if( !flag )
    {
    	//window.setTimeout( console.log("esperé"), 5000 );
    	var x = ( new Date( ) ).getTime( ) + 300;
		while( ( new Date( ) ).getTime( ) < x );
		console.log("pasó 1 seg");
    	//waitFlag( );
    }
    	
}

function updateTablePrima( _distance, _thePolygon, _howMany )
{
	tableReference = $( "#top" )[0];
	var row, col;
	var cont;
	$( "#top tr" ).remove( );
	for( i = 0; i < _distance.length; i++ )
	{
		if( cont <= _howMany ) break;

		row = tableReference.insertRow( 0 );
		col = row.insertCell( 0 );
		col.innerHTML = _thePolygon[i].boroCD;
		row.setAttribute( "class", "tableClick" );
		row.setAttribute( "data-distance", _distance[i] );
		row.setAttribute( "data-boroCD", _thePolygon[i].boroCD );
		cont++;
	}
}

function updateTable( _top3 )
{
	tableReference = $( "#top" )[0];
	var row, col;
	$( "#top tr" ).remove( );
	for( var id of ids )
	{
		if( _top3 === true && id == "4" ) break;

		row = tableReference.insertRow( 0 );
		col = row.insertCell( 0 );
		col.innerHTML = testingArrange[id][0];
		row.setAttribute( "class", "tableClick" );
		row.setAttribute( "data-id", id );
	}
}

function updatetop3( )
{
	
	updateTable( true );
}

function update( )
{
	updateTable( false );
}

//---------------------------------  D3.JS  ---------------------------------------




//------------------------------------------ Google Maps ---------------------------------------------

function onGoogleMapResponse( )
{
	map = new google.maps.Map( document.getElementById( 'googleMapContainer' ), 
		{
			zoom: 10, center: { lat: 40.7291, lng: -73.9965 }
		}
	);

	update( );
	getDataSet( DISTRICT_GEOSHAPES, map );

	window.setTimeout( getTopD, 5000 );//getTopD( );

	var marker = new google.maps.Marker
	(
		{
    		position: { lat: 40.7291, lng: -73.9965 },
    		map: map,
    		title: 'NYU',
    		label: 'NYU'
  		}
  	);

}

//------------------------------------------ Google Maps ---------------------------------------------**/

$( document ).ready
( 
	function( )
	{
		$( "#onoff" ).on( "click", update );
		$( "#safety" ).on( "click", update );
		$( "#distance" ).on( "click", update );
		$( "#affordability" ).on( "click", update );
		$( "#top3" ).on( "click", updatetop3 );
		$( "#tableScroll" ).on( "click", ".tableClick", function( )
			{
				console.log($(this).data("distance"));
				console.log("clic");
			}
		);
	}
)
