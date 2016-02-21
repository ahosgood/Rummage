/**
 * ================================================================================
 * Rummage
 * jQuery Searchables
 * --------------------------------------------------------------------------------
 * Author:      Andrew Hosgood
 * Version:     2.11.0-pre
 * Date:        2015-02-21
 * ================================================================================
 */

(
	(
		function( factory ) {
			if( typeof define === 'function' &&
					define.amd ) {
				define(
					'rummage',
					['jquery'],
					factory
				);
			} else if( typeof module === 'object' &&
					module.exports ) {
				module.exports = factory( require( 'jquery' )( window ) );
			} else {
				factory( jQuery );
			}
		}
	)(
		function( $ ) {
			$.fn.rummage = function( jqoSearchPoolContainer, objUserOptions ) {
					var jqoThisSearch = $( this );

					if( jqoThisSearch.length ) {
						var objOptions = $.extend( {}, $.fn.rummage.objDefaultOptions, objUserOptions ),
								contains = function( strNeedle, strHaystack ) {
									if( objOptions.matchCase === true ) {
										return strHaystack.indexOf( strNeedle ) !== -1;
									} else {
										return strHaystack.toLowerCase().indexOf( strNeedle.toLowerCase() ) !== -1;
									}

								},
								isBlank = function( mxdValue ) {
									return mxdValue.replace( /[\s\t\r\n]*/g, '' ) === '';
								},
								strThisSearchNodeName = jqoThisSearch[0].nodeName.toLowerCase(),
								jqoBaseSearchPool;

						if( strThisSearchNodeName !== 'input' &&
								strThisSearchNodeName !== 'select' ) {
							throw 'Rummaging can only be called on <input> and <select> elements';
						}

						if( ( typeof jqoSearchPoolContainer === 'object' &&
									( $( jqoSearchPoolContainer ) instanceof jQuery ||
										jqoSearchPoolContainer.jquery ) ) ||
								$( jqoSearchPoolContainer ).length ) {
							jqoSearchPoolContainer = $( jqoSearchPoolContainer );
							jqoBaseSearchPool = jqoSearchPoolContainer.find( '[' + objOptions.attribute + ']' );
						} else {
							throw 'Can\'t find anything to rummage';
						}

						var intBaseTotal = jqoBaseSearchPool.filter( ':not(' + objOptions.exclude + ')' ).length,
								addChangeListeners = function( jqoQueryElement ) {
									switch( jqoQueryElement[0].nodeName.toLowerCase() ) {
										case 'input':
											switch( jqoQueryElement.attr( 'type' ) ) {
												case 'checkbox':
												case 'radio':
													jqoQueryElement.off( 'click change' ).on( 'click change', funSearch );
													break;

												default:
													jqoQueryElement.off( 'keyup search' ).on( 'keyup search', funSearch );
													break;
											}
											break;

										case 'select':
											jqoQueryElement.off( 'click change' ).on( 'click change', funSearch );
											break;
									}
								},
								getSearchValueArray = function( jqoQueryElement ) {
									var arrSearchQueries = [];

									if( strThisSearchNodeName === 'input' ) {
										switch( jqoQueryElement.attr( 'type' ) ) {
											case 'radio':
												var jqoCheckedRadio = $( '[name="' + jqoQueryElement.eq( 0 ).attr( 'name' ) + '"]:checked' );

												if( jqoCheckedRadio.length ) {
													if( !isBlank( jqoCheckedRadio.val() ) ) {
														arrSearchQueries = [jqoCheckedRadio.val()];
													}
												}
												break;

											case 'checkbox':
												var jqoSelectedCheckboxes = $( '[name="' + jqoQueryElement.eq( 0 ).attr( 'name' ) + '"]:checked' );

												if( jqoSelectedCheckboxes.length ) {
													jqoSelectedCheckboxes.each(
														function( intCheckbox, jqoCheckbox ) {
															arrSearchQueries.push( $( jqoCheckbox ).attr( 'value' ) );
														}
													);
												}
												break;

											default:
												if( jqoQueryElement.val() ) {
													arrSearchQueries = [jqoQueryElement.val()];
												}
												break;
										}
									} else {
										if( jqoQueryElement.val() ) {
											arrSearchQueries = [jqoQueryElement.val()];
										}
									}

									return arrSearchQueries;
								},
								getSearchValues = function( jqoQueryElements ) {
									var arrQueries = [],
											arrReturnQueries = [];

									if( jqoQueryElements.length === 1 ) {
										arrQueries = getSearchValueArray( jqoQueryElements );
										addChangeListeners( jqoThisSearch );
									} else {
										$.each( jqoQueryElements.selector.replace( / *, */, ',' ).split( ',' ),
												function( intQueryElement, jqsQueryElement ) {
													var jqoQueryElement = $( jqsQueryElement ),
															arrThisQueries = getSearchValueArray( jqoQueryElement );

													if( arrThisQueries.length ) {
														arrQueries = arrQueries.concat( arrThisQueries );
													}

													addChangeListeners( jqoQueryElement );
												}
										);
									}

									$.each( arrQueries,
										function( intQuery, strQuery ) {
											if( arrReturnQueries.indexOf( strQuery ) === -1 ) {
												arrReturnQueries.push( strQuery );
											}
										}
									);

									return arrReturnQueries.join( ' +' );
								},
								funSearch = function() {
									var strSearchTerm = getSearchValues( jqoThisSearch ) || '',
											intResults = 0,
											jqoSearchPool = jqoBaseSearchPool.filter( ':not(' + objOptions.exclude + ')' );

									if( isBlank( strSearchTerm ) ) {
										intResults = jqoSearchPool.filter( ':not(' + objOptions.exclude + ')' ).length;
										jqoSearchPool.addClass( objOptions.matchClass ).removeClass( objOptions.noMatchClass );
										jqoSearchPoolContainer.removeClass( objOptions.searchingClass + ' ' + objOptions.noResultsClass );
									} else if( objOptions.regex ) {
										try {
											var regExTest = new RegExp( strSearchTerm, 'm' );

											//jqoSearchPoolContainer.each(
												//function() {
													//var jqoTarget = $( this );

													if( !jqoSearchPoolContainer.hasClass( objOptions.searchingClass ) ) {
														jqoSearchPoolContainer.addClass( objOptions.searchingClass );
													}

													jqoSearchPool.each(
														function() {
															var jqoSearchableItem = $( this ),
																	strSearchables = jqoSearchableItem.attr( objOptions.attribute ),
																	blMatch = false;

															if( regExTest.test( strSearchables ) ||
																	( objOptions.searchText &&
																		regExTest.test( jqoSearchableItem.text() ) ) ) {
																blMatch = true;
															}

															if( blMatch ) {
																intResults++;

																if( !isBlank( objOptions.matchClass ) ) {
																	jqoSearchableItem.addClass( objOptions.matchClass );
																}
																if( !isBlank( objOptions.noMatchClass ) ) {
																	jqoSearchableItem.removeClass( objOptions.noMatchClass );
																}
															} else {
																if( !isBlank( objOptions.noMatchClass ) ) {
																	jqoSearchableItem.addClass( objOptions.noMatchClass );
																}
																if( !isBlank( objOptions.matchClass ) ) {
																	jqoSearchableItem.removeClass( objOptions.matchClass );
																}
															}
														}
													);

												//}
											//);
										} catch( e ) {
											intResults = jqoSearchPool.find( '.' + objOptions.matchClass ).length;
										}
									} else {
										var arrAbsoluteSearchTerms = ( objOptions.matchCase === true ) ? strSearchTerm.match( /[\+\-]?("([^"]*)"|'([^']*)')/g ) : strSearchTerm.match( /[\+\-]?("([^"]*)"|'([^']*)')/gi ),
										strSearchTermSansAbsolute = ( objOptions.matchCase === true ) ? strSearchTerm.replace( /[\+\-]?("[^"]*"|'[^']*')/g, '' ) : strSearchTerm.replace( /[\+\-]?("[^"]*"|'[^']*')/gi, '' ),
										arrSearchTerms = arrAbsoluteSearchTerms ? strSearchTermSansAbsolute.split( ' ' ).concat( arrAbsoluteSearchTerms ) : strSearchTermSansAbsolute.split( ' ' );

										//jqoSearchPoolContainer.each(
											//function() {
												//var jqoTarget = $( this );
												if( !jqoSearchPoolContainer.hasClass( objOptions.searchingClass ) ) {
													jqoSearchPoolContainer.addClass( objOptions.searchingClass );
												}

												jqoSearchPool.each(
													function() {
														var jqoSearchableItem = $( this ),
																strSearchables = jqoSearchableItem.attr( objOptions.attribute ),
																intMatches = 0;

														if( objOptions.exactMatch === true ) {
															if( objOptions.searchText ) {
																intMatches = ( strSearchTerm === jqoSearchableItem.text() ) ? 1 : 0;
															} else {
																intMatches = ( strSearchTerm === jqoSearchableItem.attr( objOptions.attribute ) ) ? 1 : 0;
															}
														} else {
															if( objOptions.searchText ) {
																strSearchables = ( strSearchables === '' ) ? jqoSearchableItem.text() : strSearchables + ',' + jqoSearchableItem.text();
															}

															for( var intTerm = 0, intTerms = arrSearchTerms.length; intTerm < intTerms; intTerm++ ) {
																var strSearchTermPiece = arrSearchTerms[intTerm];

																if( strSearchTermPiece !== '' ) {
																	if( strSearchTermPiece.length > 1 &&
																			strSearchTermPiece.substr( 0, 1 ) === '+' &&
																			!contains( strSearchTermPiece.substr( 1 ).replace( /^"/, '' ).replace( /"$/, '' ), strSearchables ) ) {
																		intMatches = 0;
																		break;
																	} else if( strSearchTermPiece.length > 1 &&
																			strSearchTermPiece.substr( 0, 1 ) === '-' &&
																			contains( strSearchTermPiece.substr( 1 ).replace( /^"/, '' ).replace( /"$/, '' ), strSearchables ) ) {
																		intMatches = 0;
																		break;
																	} else {
																		strSearchTermPiece = strSearchTermPiece.replace( /^"/, '' ).replace( /"$/, '' );
																		while( contains( strSearchTermPiece, strSearchables ) ) {
																			var intMatchStart = strSearchables.indexOf( strSearchTermPiece );
																			strSearchables = strSearchables.substring( 0, intMatchStart ) + strSearchables.substr( intMatchStart + strSearchTermPiece.length );
																			intMatches++;
																			if( !objOptions.score ) {
																				break;
																			}
																		}
																	}
																}
															}
														}

														if( intMatches > 0 ) {
															intResults++;

															if( !isBlank( objOptions.matchClass ) ) {
																jqoSearchableItem.addClass( objOptions.matchClass );
															}
															if( !isBlank( objOptions.noMatchClass ) ) {
																jqoSearchableItem.removeClass( objOptions.noMatchClass );
															}
														} else {
															if( !isBlank( objOptions.noMatchClass ) ) {
																jqoSearchableItem.addClass( objOptions.noMatchClass );
															}
															if( !isBlank( objOptions.matchClass ) ) {
																jqoSearchableItem.removeClass( objOptions.matchClass );
															}
														}

														if( objOptions.score ) {
															jqoSearchableItem.attr( 'data-rummagescore', intMatches );
														}
													}
												);
											//}
										//);
									}

									if( intResults === 0 ) {
										jqoSearchPoolContainer.addClass( objOptions.noResultsClass );
									} else {
										jqoSearchPoolContainer.removeClass( objOptions.noResultsClass );
									}

									if( ( typeof objOptions.results === 'object' &&
												( $( objOptions.results ) instanceof jQuery ||
													objOptions.results.jquery ) ) ||
											$( objOptions.results ).length ) {
										$( objOptions.results ).text( intResults );
									}

									if( ( ( typeof objOptions.total === 'object' &&
													( $( objOptions.total ) instanceof jQuery ||
														objOptions.total.jquery ) ) ||
												$( objOptions.total ).length ) &&
											jqoSearchPool.length !== intBaseTotal ) {
										intBaseTotal = jqoSearchPool.length;
										$( objOptions.total ).text( intBaseTotal );
									}
								};

						if( objOptions.searchOnLoad ) {
							funSearch();
						}

						jqoThisSearch.on(
							{
								'rummage.reindex': funSearch
							}
						);

						if( ( typeof objOptions.total === 'object' &&
									( $( objOptions.total ) instanceof jQuery ||
										objOptions.total.jquery ) ) ||
								$( objOptions.total ).length ) {
							$( objOptions.total ).text( intBaseTotal );
						}
					}

					return this;
				};

			$.fn.rummage.objDefaultOptions = {
					attribute: 'data-rummage',
					exclude: '.rummage-exclude',
					exactMatch: false,
					matchCase: false,
					matchClass: '',
					noMatchClass: 'rummage-nomatch',
					noResultsClass: 'rummage-noresults',
					regex: false,
					results: '',
					score: false,
					searchingClass: 'rummage-searching',
					searchOnLoad: true,
					searchText: false,
					total: ''
				};
		}
	)
);