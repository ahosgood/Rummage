/**
 * ================================================================================
 * Rummage
 * jQuery Searchables
 * --------------------------------------------------------------------------------
 * Author:      Andrew Hosgood
 * Version:     2.8.1
 * Date:        08/11/2014
 * ================================================================================
 */

(
	function( $ ) {
		try {
			if( window.jQuery ) {
				$.fn.rummage = function( jqoSearchTarget, objUserOptions ) {
						var objOptions = $.extend( {}, $.fn.rummage.objDefaultOptions, objUserOptions ),
						contains = function( strNeedle, strHaystack ) {
								if( objOptions.matchCase === true ) {
									return strHaystack.indexOf( strNeedle ) !== -1;
								} else {
									return strHaystack.toLowerCase().indexOf( strNeedle.toLowerCase() ) !== -1;
								}

							},
						isBlank = function( mxdValue ) {
								return mxdValue.replace( /[\s\t\r\n]*/g, '' ) == '';
							};
					
						return this.each(
							function() {
								var jqoThisSearch = $( this ),
								strThisSearchNodeName = jqoThisSearch[0].nodeName.toLowerCase();

								if( strThisSearchNodeName === 'input'
										|| strThisSearchNodeName === 'select' ) {
									var jqoBaseSearchPool;

									if( ( typeof jqoSearchTarget === 'object'
												&& ( $( jqoSearchTarget ) instanceof jQuery
													|| jqoSearchTarget.jquery ) )
											|| $( jqoSearchTarget ).length ) {
										jqoSearchTarget = $( jqoSearchTarget );
										jqoBaseSearchPool = jqoSearchTarget.find( '[' + objOptions.attribute + ']' );
									} else {
										throw 'Can\'t find anything to rummage';
									}

									var intBaseTotal = jqoBaseSearchPool.filter( ':not(' + objOptions.exclude + ')' ).length,
									funSearch = function() {
											var strSearchTerm = jqoThisSearch.val(),
											intResults = 0,
											jqoSearchPool = jqoBaseSearchPool.filter( ':not(' + objOptions.exclude + ')' );

											if( isBlank( strSearchTerm ) ) {
												intResults = jqoSearchPool.filter( ':not(' + objOptions.exclude + ')' ).length;
												jqoSearchPool.addClass( objOptions.matchClass ).removeClass( objOptions.noMatchClass ),
												jqoSearchTarget.removeClass( objOptions.searchingClass + ' ' + objOptions.noResultsClass );
											} else if( objOptions.regex ) {
												try {
													var regExTest = new RegExp( strSearchTerm, 'm' );

													//jqoSearchTarget.each(
														//function() {
															//var jqoTarget = $( this );

															if( !jqoSearchTarget.hasClass( objOptions.searchingClass ) ) {
																jqoSearchTarget.addClass( objOptions.searchingClass );
															}

															jqoSearchPool.each(
																function() {
																	var jqoSearchableItem = $( this ),
																	strSearchables = jqoSearchableItem.attr( objOptions.attribute ),
																	blMatch = false;

																	if( regExTest.test( strSearchables )
																			|| ( objOptions.searchText
																				&& regExTest.test( jqoSearchableItem.text() ) ) ) {
																		blMatch = true;
																	}

																	if( blMatch ) {
																		intResults++;

																		if( !isBlank( objOptions.matchClass ) ) {
																			jqoSearchableItem.addClass( objOptions.matchClass )
																		}
																		if( !isBlank( objOptions.noMatchClass ) ) {
																			jqoSearchableItem.removeClass( objOptions.noMatchClass );
																		}
																	} else {
																		if( !isBlank( objOptions.noMatchClass ) ) {
																			jqoSearchableItem.addClass( objOptions.noMatchClass );
																		}
																		if( !isBlank( objOptions.matchClass ) ) {
																			jqoSearchableItem.removeClass( objOptions.matchClass )
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

												//jqoSearchTarget.each(
													//function() {
														//var jqoTarget = $( this );
														if( !jqoSearchTarget.hasClass( objOptions.searchingClass ) ) {
															jqoSearchTarget.addClass( objOptions.searchingClass );
														}

														jqoSearchPool.each(
															function() {
																var jqoSearchableItem = $( this ),
																		strSearchables = jqoSearchableItem.attr( objOptions.attribute ),
																		intMatches = 0;

																if( strThisSearchNodeName === 'select' ) {
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
																			if( strSearchTermPiece.length > 1
																					&& strSearchTermPiece.substr( 0, 1 ) === '+'
																					&& !contains( strSearchTermPiece.substr( 1 ).replace( /^"/, '' ).replace( /"$/, '' ), strSearchables ) ) {
																				intMatches = 0;
																				break;
																			} else if( strSearchTermPiece.length > 1
																					&& strSearchTermPiece.substr( 0, 1 ) === '-'
																					&& contains( strSearchTermPiece.substr( 1 ).replace( /^"/, '' ).replace( /"$/, '' ), strSearchables ) ) {
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
												jqoSearchTarget.addClass( objOptions.noResultsClass );
											} else {
												jqoSearchTarget.removeClass( objOptions.noResultsClass );
											}

											if( ( typeof objOptions.results === 'object'
														&& ( $( objOptions.results ) instanceof jQuery
															|| objOptions.results.jquery ) )
													|| $( objOptions.results ).length ) {
												$( objOptions.results ).text( intResults );
											}

											if( ( ( typeof objOptions.total === 'object'
															&& ( $( objOptions.total ) instanceof jQuery
																|| objOptions.total.jquery ) )
														|| $( objOptions.total ).length )
													&& jqoSearchPool.length !== intBaseTotal ) {
												intBaseTotal = jqoSearchPool.length;
												$( objOptions.total ).text( intBaseTotal );
											}
										};

									if( objOptions.searchOnLoad ) {
										funSearch();
									}

									switch( strThisSearchNodeName ) {
										case 'input':
											jqoThisSearch.off( 'keyup search' ).on( 'keyup search', funSearch );
											break;

										case 'select':
											jqoThisSearch.off( 'click' ).on( 'click', funSearch );
											break;
									}

									jqoThisSearch.on(
										{
											'rummage.reindex': funSearch
										}
									);

									if( ( typeof objOptions.total === 'object'
												&& ( $( objOptions.total ) instanceof jQuery
													|| objOptions.total.jquery ) )
											|| $( objOptions.total ).length ) {
										$( objOptions.total ).text( intBaseTotal );
									}
								} else {
									throw 'Rummaging can only be called on INPUT and SELECT elements';
								}
							}
						);
					},
				$.fn.rummage.objDefaultOptions = {
						attribute: 'data-rummage',
						exclude: '.rummage-exclude',
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
			} else {
				throw 'Rummage requires jQuery to run';
			}
		} catch( err ) {
			if( window.console ) {
				if( window.console.error ) {
					console.error( err );
				} else if( window.console.log ) {
					console.log( err );
				}
			}
		}
	}
)( jQuery );