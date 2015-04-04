/**
 * ================================================================================
 * Rummage
 * jQuery Searchables
 * --------------------------------------------------------------------------------
 * Author:      Andrew Hosgood
 * Version:     3.0.0 Pre-release
 * Date:        04/04/2015
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
										strThisSearchNodeName = jqoThisSearch[0].nodeName.toLowerCase(),
										blHideSearchPoolOnBlur = false,
										blAutocomplete = false,
										intAutocompleteSelected = 0,
										jqoAutocompleteValue;

								if( strThisSearchNodeName === 'input'
										|| strThisSearchNodeName === 'select' ) {
									var jqoBaseSearchPool;

									if( ( typeof jqoSearchTarget === 'object'
												&& jqoSearchTarget.jquery )
											|| ( typeof jqoSearchTarget == 'string'
												&& $( jqoSearchTarget ).length ) ) {
										jqoSearchTarget = $( jqoSearchTarget );
									} else if( typeof jqoSearchTarget === 'object' ) {
										var objSearchTargetData = jqoSearchTarget;

										jqoSearchTarget = $( '<ul class="rummage-autocomplete"/>' );

										for( var mxdData in objSearchTargetData ) {
											jqoSearchTarget.append( '<li ' + objOptions.attribute + '="' + mxdData + '">' + objSearchTargetData[mxdData] + '</li>' );
										}

										jqoAutocompleteValue = $( '<input type="hidden"/>' );

										if( jqoThisSearch.attr( 'name' ) ) {
											jqoAutocompleteValue.attr( 'name', jqoThisSearch.attr( 'name' ) ),
											jqoThisSearch.removeAttr( 'name' );
										}

										jqoThisSearch.after( jqoSearchTarget ).after( jqoAutocompleteValue );

										jqoSearchTarget.css(
											{
												margin: '0',
												padding: '0',
												position: 'absolute',
												top: jqoThisSearch.offset().top + jqoThisSearch.outerHeight(),
												left: jqoThisSearch.offset().left,
												listStyle: 'none'
											}
										).on( 'click', 'li',
											function() {
												var jqoThisOption = $( this );
												jqoThisSearch.val( jqoThisOption.text() ),
												jqoAutocompleteValue.val( jqoThisOption.attr( objOptions.attribute ) );
												jqoSearchTarget.hide();
											}
										).hide();

										objOptions.searchText = true;
										blHideSearchPoolOnBlur = true;
										blAutocomplete = true;
									} else {
										throw 'Can\'t find anything to rummage';
									}

									jqoBaseSearchPool = jqoSearchTarget.find( '[' + objOptions.attribute + ']' );

									jqoBaseSearchPool.each(
										function() {
											var jqoThisItem = $( this ),
													objItemData = {
															'rummage.attribute-content': jqoThisItem.attr( objOptions.attribute )
														};

											if( objOptions.searchText ) {
												objItemData['rummage.attribute-content'] = ( objItemData['rummage.attribute-content'] === '' ) ? jqoThisItem.text() : objItemData['rummage.attribute-content'] + ',' + jqoThisItem.text();
											}

											jqoThisItem.data( objItemData );
										}
									);

									var intResults = 0,
											intBaseTotal = jqoBaseSearchPool.filter( ':not(' + objOptions.exclude + ')' ).length,
											strSearchTerm = '',
											funSearch = function() {
													var jqoSearchPool = jqoBaseSearchPool.filter( ':not(' + objOptions.exclude + ')' ),
															intPerformance = performance.now();

													strSearchTerm = jqoThisSearch.val();
													intResults = 0;

													if( strSearchTerm !== jqoThisSearch.data( 'rummage.last-query', strSearchTerm ) ) {
														if( isBlank( strSearchTerm ) ) {
															intResults = jqoSearchPool.filter( ':not(' + objOptions.exclude + ')' ).length;
															jqoSearchPool.addClass( objOptions.matchClass ).removeClass( objOptions.noMatchClass ).removeAttr( 'data-rummagescore' ),
															jqoSearchTarget.removeClass( objOptions.searchingClass + ' ' + objOptions.noResultsClass );
														} else if( objOptions.regex ) {
															try {
																var regExTest = new RegExp( strSearchTerm, objOptions.matchCase ? 'm' : 'mi' );

																if( !jqoSearchTarget.hasClass( objOptions.searchingClass ) ) {
																	jqoSearchTarget.addClass( objOptions.searchingClass );
																}

																jqoSearchPool.each(
																	function() {
																		var jqoSearchableItem = $( this ),
																				strSearchables = jqoSearchableItem.data( 'rummage.attribute-content' ),
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
															} catch( e ) {
																intResults = jqoSearchPool.find( '.' + objOptions.matchClass ).length;
															}
														} else {
															var arrAbsoluteSearchTerms = ( objOptions.matchCase === true ) ? strSearchTerm.match( /[\+\-]?("([^"]*)"|'([^']*)')/g ) : strSearchTerm.match( /[\+\-]?("([^"]*)"|'([^']*)')/gi ),
																	strSearchTermSansAbsolute = ( objOptions.matchCase === true ) ? strSearchTerm.replace( /[\+\-]?("[^"]*"|'[^']*')/g, '' ) : strSearchTerm.replace( /[\+\-]?("[^"]*"|'[^']*')/gi, '' ),
																	arrSearchTerms = arrAbsoluteSearchTerms ? strSearchTermSansAbsolute.split( ' ' ).concat( arrAbsoluteSearchTerms ) : strSearchTermSansAbsolute.split( ' ' );

															if( !jqoSearchTarget.hasClass( objOptions.searchingClass ) ) {
																jqoSearchTarget.addClass( objOptions.searchingClass );
															}

															jqoSearchPool.each(
																function() {
																	var jqoSearchableItem = $( this ),
																			strSearchables = jqoSearchableItem.data( 'rummage.attribute-content' ),
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

																			var strSearchTermPieceCleaned = strSearchTermPiece.replace( /^[\+\-]?"/, '' ).replace( /"$/, '' );

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
																				} else if( strSearchTermPiece.substr( 0, 1 ) !== '+'
																						&& strSearchTermPiece.substr( 0, 1 ) !== '-' ) {
																					intMatches += ( strSearchables.match( new RegExp( strSearchTermPieceCleaned, objOptions.matchCase ? 'g' : 'gi' ) ) || [] ).length;
																					strSearchables = strSearchables.replace( new RegExp( strSearchTermPieceCleaned, objOptions.matchCase ? 'g' : 'gi' ), '' );
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
													}

													jqoThisSearch.data( 'rummage.last-query', strSearchTerm );
													console.log( ( performance.now() - intPerformance ) + 'ms' );
												};

									if( objOptions.searchOnLoad ) {
										funSearch();
									}

									switch( strThisSearchNodeName ) {
										case 'input':
											if( blAutocomplete ) {
												jqoThisSearch.on( 'focus',
													function() {
														jqoSearchTarget.css(
															{
																top: jqoThisSearch.offset().top + jqoThisSearch.outerHeight(),
																left: jqoThisSearch.offset().left
															}
														).show();
													}
												).on( 'keyup',
													function( e ) {
														e = e ? e : window.event;

														var jqoSearchMatches = jqoBaseSearchPool.filter( ':not(' + objOptions.exclude + ',.' + objOptions.noMatchClass + ')' ),
																intKeyCode = e.which ? e.which : e.keyCode;

														switch( intKeyCode ) {
															case 13:
																//Enter
																e.preventDefault();
																var jqoMatchedElement = jqoSearchMatches.eq( intAutocompleteSelected - 1 );

																strSearchTerm = jqoMatchedElement.text();
																jqoThisSearch.val( strSearchTerm ),
																jqoAutocompleteValue.val( jqoMatchedElement.attr( objOptions.attribute ) ),
																jqoSearchTarget.hide();
																break;

															case 38:
															case 40:
																e.preventDefault();

																jqoSearchTarget.show();

																switch( intKeyCode ) {
																	case 38:
																		//Up
																		intAutocompleteSelected = ( intAutocompleteSelected === 0 ) ? jqoSearchMatches.length : intAutocompleteSelected - 1;
																		break;

																	case 40:
																		//Down
																		intAutocompleteSelected = ( intAutocompleteSelected >= jqoSearchMatches.length ) ? 0 : intAutocompleteSelected + 1;
																		break;
																}

																console.log( intAutocompleteSelected + '/' + jqoSearchMatches.length );

																if( intAutocompleteSelected === 0 ) {
																	jqoThisSearch.val( strSearchTerm ),
																	jqoAutocompleteValue.val( '' );
																} else {
																	var jqoMatchedElement = jqoSearchMatches.eq( intAutocompleteSelected - 1 );

																	jqoThisSearch.val( jqoMatchedElement.text() );
																}

																break;

															default:
																intAutocompleteSelected = 0;
																jqoAutocompleteValue.val( '' );
																funSearch();
																break;
														}

														//strSearchTerm
													}
												).on( 'blur',
													function() {
														//jqoSearchTarget.hide();
														jqoThisSearch.val( strSearchTerm );
													}
												);
											} else {
												jqoThisSearch.off( 'keyup search' ).on( 'keyup search', funSearch );
											}
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
						selectedClass: 'rummage-selected',
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